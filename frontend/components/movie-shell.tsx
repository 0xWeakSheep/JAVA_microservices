"use client";

import { FormEvent, useEffect, useState } from "react";
import { clearAuthSession, loadAuthSession, saveAuthSession, type AuthSession, type AuthUser } from "../lib/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001/api";

type User = AuthUser;

type Movie = {
  movieId: number;
  title: string;
  description: string;
  releaseDate: string;
  runtime: number;
  posterImage: string;
  averageScore: number;
};

type Review = {
  reviewId: number;
  movieId: number;
  userId: number;
  content: string;
  score: number;
  createdAt: string;
  username?: string;
  title?: string;
};

type AuthMode = "login" | "register";

type ApiError = {
  message?: string;
};

const emptyMovieForm = {
  title: "",
  description: "",
  releaseDate: "",
  runtime: "",
  posterImage: "",
};

export function MovieShell() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [movieForm, setMovieForm] = useState(emptyMovieForm);

  useEffect(() => {
    const session = loadAuthSession();
    if (!session) {
      setAuthReady(true);
      return;
    }

    void restoreSession(session);
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    void loadMovies();
  }, [user]);

  function clearSessionState() {
    clearAuthSession();
    setToken(null);
    setUser(null);
  }

  async function restoreSession(session: AuthSession) {
    try {
      const currentUser = await request<User>("/auth/me", undefined, session.token);
      setToken(session.token);
      setUser(currentUser);
      saveAuthSession({ token: session.token, user: currentUser });
    } catch {
      clearSessionState();
    } finally {
      setAuthReady(true);
    }
  }

  async function request<T>(path: string, init?: RequestInit, authToken?: string | null): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(authToken || token
          ? { Authorization: `Bearer ${authToken || token}` }
          : {}),
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      let message = "Request failed";
      if (text) {
        try {
          const payload = JSON.parse(text) as ApiError;
          message = payload.message || text;
        } catch {
          message = text;
        }
      }

      if (response.status === 401) {
        clearSessionState();
      }

      throw new Error(message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  async function loadMovies(title?: string) {
    setLoading(true);
    try {
      const query = title ? `?title=${encodeURIComponent(title)}` : "";
      const data = await request<Movie[]>(`/movies${query}`, {
        headers: {},
      });
      setMovies(data);
      if (selectedMovie) {
        const refreshed = data.find((movie) => movie.movieId === selectedMovie.movieId);
        setSelectedMovie(refreshed ?? null);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "加载电影失败");
    } finally {
      setLoading(false);
    }
  }

  async function loadMovieDetail(movieId: number) {
    setLoading(true);
    try {
      const [movie, movieReviews] = await Promise.all([
        request<Movie>(`/movies/${movieId}`),
        request<Review[]>(`/reviews?movieId=${movieId}`),
      ]);
      setSelectedMovie(movie);
      setReviews(movieReviews);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "加载详情失败");
    } finally {
      setLoading(false);
    }
  }

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const formData = new FormData(event.currentTarget);
    try {
      const data = await request<AuthSession>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });
      setToken(data.token);
      setUser(data.user);
      saveAuthSession(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "登录失败");
    }
  }

  async function onRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const formData = new FormData(event.currentTarget);
    try {
      await request<User>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
          email: formData.get("email"),
        }),
      });
      setAuthMode("login");
      setMessage("注册成功，请登录");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "注册失败");
    }
  }

  async function onCreateMovie(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      await request<Movie>("/movies", {
        method: "POST",
        body: JSON.stringify({
          ...movieForm,
          runtime: Number(movieForm.runtime),
        }),
      });
      setMovieForm(emptyMovieForm);
      await loadMovies();
      setMessage("电影已创建");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "创建电影失败");
    }
  }

  async function onCreateReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMovie || !user) {
      return;
    }
    setMessage("");
    const formData = new FormData(event.currentTarget);
    try {
      await request<Review>("/reviews", {
        method: "POST",
        body: JSON.stringify({
          movieId: selectedMovie.movieId,
          content: formData.get("content"),
          score: Number(formData.get("score")),
        }),
      });
      event.currentTarget.reset();
      await loadMovieDetail(selectedMovie.movieId);
      await loadMovies();
      setMessage("评论已发布");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "评论失败");
    }
  }

  async function onDeleteMovie(movieId: number) {
    setMessage("");
    try {
      await request<void>(`/movies/${movieId}`, { method: "DELETE" });
      if (selectedMovie?.movieId === movieId) {
        setSelectedMovie(null);
        setReviews([]);
      }
      await loadMovies();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "删除电影失败");
    }
  }

  if (!authReady) {
    return (
      <main className="landing">
        <section className="auth-panel">
          <div className="auth-card">
            <p className="muted">正在恢复登录状态...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="landing">
        <section className="auth-panel">
          <div className="auth-copy">
            <p className="eyebrow">Movies Control Room</p>
            <h1>用 Next.js 重建的前端入口。</h1>
            <p className="lede">
              前端运行在 3002，直接调用 3001 的 REST API，不再走 MVC 模板。
            </p>
          </div>
          <div className="auth-card">
            <div className="tab-row">
              <button
                className={authMode === "login" ? "active" : ""}
                onClick={() => setAuthMode("login")}
                type="button"
              >
                登录
              </button>
              <button
                className={authMode === "register" ? "active" : ""}
                onClick={() => setAuthMode("register")}
                type="button"
              >
                注册
              </button>
            </div>
            {authMode === "login" ? (
              <form className="stack" onSubmit={onLogin}>
                <input name="username" placeholder="用户名" required />
                <input name="password" placeholder="密码" required type="password" />
                <button className="primary" type="submit">
                  登录系统
                </button>
              </form>
            ) : (
              <form className="stack" onSubmit={onRegister}>
                <input name="username" placeholder="用户名" required />
                <input name="email" placeholder="邮箱" required type="email" />
                <input name="password" placeholder="密码" required type="password" />
                <button className="primary" type="submit">
                  创建账号
                </button>
              </form>
            )}
            {message ? <p className="notice">{message}</p> : null}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <header className="hero">
        <div>
          <p className="eyebrow">Online</p>
          <h1>欢迎，{user.username}</h1>
          <p className="lede">
            当前身份：{user.manager ? "管理员" : "普通用户"}，所有数据来自 Spring Boot API。
          </p>
        </div>
        <div className="hero-actions">
          <button className="ghost" onClick={() => void loadMovies()}>
            刷新列表
          </button>
          <button
            className="ghost"
            onClick={() => {
              clearSessionState();
              setSelectedMovie(null);
              setReviews([]);
              setMovies([]);
              setMessage("");
            }}
          >
            退出
          </button>
        </div>
      </header>

      <section className="workspace">
        <div className="panel large">
          <div className="panel-head">
            <h2>电影库</h2>
            <form
              className="search-row"
              onSubmit={(event) => {
                event.preventDefault();
                void loadMovies(keyword.trim() || undefined);
              }}
            >
              <input
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="输入标题关键字"
                value={keyword}
              />
              <button className="primary" type="submit">
                搜索
              </button>
            </form>
          </div>
          {loading ? <p className="muted">加载中...</p> : null}
          <div className="movie-grid">
            {movies.map((movie) => (
              <article className="movie-card" key={movie.movieId}>
                {movie.posterImage ? (
                  <img
                    src={movie.posterImage}
                    alt={movie.title}
                    className="movie-poster"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="movie-poster-placeholder">暂无海报</div>
                )}
                <div className="movie-meta">
                  <span>{movie.runtime || "-"} min</span>
                  <span>{Number(movie.averageScore || 0).toFixed(1)}</span>
                </div>
                <h3>{movie.title}</h3>
                <p>{movie.description || "暂无简介"}</p>
                <div className="card-actions">
                  <button className="primary" onClick={() => void loadMovieDetail(movie.movieId)}>
                    查看详情
                  </button>
                  {user.manager ? (
                    <button className="ghost" onClick={() => void onDeleteMovie(movie.movieId)}>
                      删除
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="panel sidebar">
          {user.manager ? (
            <section className="stack">
              <h2>新增电影</h2>
              <form className="stack" onSubmit={onCreateMovie}>
                <input
                  onChange={(event) =>
                    setMovieForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="电影名"
                  required
                  value={movieForm.title}
                />
                <textarea
                  onChange={(event) =>
                    setMovieForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="简介"
                  required
                  value={movieForm.description}
                />
                <input
                  onChange={(event) =>
                    setMovieForm((current) => ({
                      ...current,
                      releaseDate: event.target.value,
                    }))
                  }
                  required
                  type="date"
                  value={movieForm.releaseDate}
                />
                <input
                  onChange={(event) =>
                    setMovieForm((current) => ({ ...current, runtime: event.target.value }))
                  }
                  placeholder="时长"
                  required
                  type="number"
                  value={movieForm.runtime}
                />
                <input
                  onChange={(event) =>
                    setMovieForm((current) => ({
                      ...current,
                      posterImage: event.target.value,
                    }))
                  }
                  placeholder="海报地址"
                  required
                  value={movieForm.posterImage}
                />
                <button className="primary" type="submit">
                  发布电影
                </button>
              </form>
            </section>
          ) : (
            <section className="stack">
              <h2>当前说明</h2>
              <p className="muted">
                普通用户可以浏览电影和发布评论。管理员额外拥有新增、删除电影的能力。
              </p>
            </section>
          )}

          {selectedMovie ? (
            <section className="detail-column">
              <div className="detail-header">
                <p className="eyebrow">Detail</p>
                {selectedMovie.posterImage ? (
                  <img
                    src={selectedMovie.posterImage}
                    alt={selectedMovie.title}
                    className="detail-poster"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <h2>{selectedMovie.title}</h2>
                <p className="muted">{selectedMovie.description}</p>
              </div>
              <div className="detail-metrics">
                <span>评分 {Number(selectedMovie.averageScore || 0).toFixed(1)}</span>
                <span>{selectedMovie.runtime || "-"} 分钟</span>
              </div>
              <form className="stack" onSubmit={onCreateReview}>
                <input max={10} min={1} name="score" placeholder="评分 1-10" required type="number" />
                <textarea name="content" placeholder="写点评论" required />
                <button className="primary" type="submit">
                  提交评论
                </button>
              </form>
              <div className="review-list">
                {reviews.map((review) => (
                  <article className="review-card" key={review.reviewId}>
                    <div className="review-top">
                      <strong>{review.username || "匿名用户"}</strong>
                      <span>{review.score}/10</span>
                    </div>
                    <p>{review.content}</p>
                    <time>{new Date(review.createdAt).toLocaleString()}</time>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <section className="stack">
              <h2>电影详情</h2>
              <p className="muted">从左侧选择一部电影后，这里会加载评论和提交入口。</p>
            </section>
          )}

          {message ? <p className="notice">{message}</p> : null}
        </aside>
      </section>
    </main>
  );
}
