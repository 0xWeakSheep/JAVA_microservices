"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
  type AuthSession,
  type AuthUser,
} from "../lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001/api";

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

type LogEntry = {
  id: number;
  methodName: string;
  userName: string;
  timestamp: string;
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

function toDateInputValue(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function MovieShell() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [logLoading, setLogLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);
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
    if (user.manager) {
      void loadLogs();
    }
  }, [user]);

  function clearSessionState() {
    clearAuthSession();
    setToken(null);
    setUser(null);
  }

  function resetMovieEditor() {
    setEditingMovieId(null);
    setMovieForm(emptyMovieForm);
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
        ...(authToken || token ? { Authorization: `Bearer ${authToken || token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      let parsedMessage = "Request failed";

      if (text) {
        try {
          const payload = JSON.parse(text) as ApiError;
          parsedMessage = payload.message || text;
        } catch {
          parsedMessage = text;
        }
      }

      if (response.status === 401) {
        clearSessionState();
      }

      throw new Error(parsedMessage);
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
      const data = await request<Movie[]>(`/movies${query}`);
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

  async function loadLogs() {
    setLogLoading(true);
    try {
      const data = await request<LogEntry[]>("/logs");
      setLogs(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "加载日志失败");
    } finally {
      setLogLoading(false);
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
      setMessage(data.user.manager ? "管理员登录成功" : "登录成功");
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

  async function onSubmitMovie(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const payload = {
      ...movieForm,
      runtime: Number(movieForm.runtime),
    };

    try {
      if (editingMovieId) {
        const updatedMovie = await request<Movie>(`/movies/${editingMovieId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (selectedMovie?.movieId === editingMovieId) {
          setSelectedMovie(updatedMovie);
        }
        setMessage("电影已更新");
      } else {
        await request<Movie>("/movies", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("电影已创建");
      }

      resetMovieEditor();
      await loadMovies();
      if (user?.manager) {
        await loadLogs();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : editingMovieId ? "更新电影失败" : "创建电影失败");
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
      if (user.manager) {
        await loadLogs();
      }
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
      if (editingMovieId === movieId) {
        resetMovieEditor();
      }
      await loadMovies();
      if (user?.manager) {
        await loadLogs();
      }
      setMessage("电影已删除");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "删除电影失败");
    }
  }

  function startEditingMovie(movie: Movie) {
    setEditingMovieId(movie.movieId);
    setMovieForm({
      title: movie.title,
      description: movie.description,
      releaseDate: toDateInputValue(movie.releaseDate),
      runtime: String(movie.runtime ?? ""),
      posterImage: movie.posterImage ?? "",
    });
    setMessage(`正在编辑《${movie.title}》`);
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
            <p className="lede">前端运行在 3002，直接调用 3001 的 REST API，不再走 MVC 模板。</p>
            <div className="root-hint">
              <strong>内置管理员账号</strong>
              <p>用户名：root</p>
              <p>密码：root</p>
            </div>
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
                <input defaultValue="root" name="username" placeholder="用户名" required />
                <input defaultValue="root" name="password" placeholder="密码" required type="password" />
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
            当前身份：{user.manager ? "管理员" : "普通用户"}。管理员可以进行电影增删改查，并查看系统日志。
          </p>
        </div>
        <div className="hero-actions">
          <button className="ghost" onClick={() => void loadMovies()}>
            刷新电影
          </button>
          {user.manager ? (
            <button className="ghost" onClick={() => void loadLogs()}>
              刷新日志
            </button>
          ) : null}
          <button
            className="ghost"
            onClick={() => {
              clearSessionState();
              resetMovieEditor();
              setSelectedMovie(null);
              setReviews([]);
              setMovies([]);
              setLogs([]);
              setMessage("");
            }}
          >
            退出
          </button>
        </div>
      </header>

      {user.manager ? (
        <section className="admin-hub">
          <section className="panel admin-panel">
            <div className="admin-panel-head">
              <div>
                <p className="eyebrow">Admin</p>
                <h2>{editingMovieId ? "编辑电影" : "新增电影"}</h2>
              </div>
              {editingMovieId ? (
                <button className="ghost" onClick={resetMovieEditor} type="button">
                  取消编辑
                </button>
              ) : null}
            </div>
            <div className="admin-metrics">
              <div className="metric-card">
                <span>电影总数</span>
                <strong>{movies.length}</strong>
              </div>
              <div className="metric-card">
                <span>日志条数</span>
                <strong>{logs.length}</strong>
              </div>
              <div className="metric-card">
                <span>当前管理员</span>
                <strong>{user.username}</strong>
              </div>
            </div>
            <form className="stack" onSubmit={onSubmitMovie}>
              <input
                onChange={(event) => setMovieForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="电影名"
                required
                value={movieForm.title}
              />
              <textarea
                onChange={(event) =>
                  setMovieForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="简介"
                required
                value={movieForm.description}
              />
              <input
                onChange={(event) =>
                  setMovieForm((current) => ({ ...current, releaseDate: event.target.value }))
                }
                required
                type="date"
                value={movieForm.releaseDate}
              />
              <input
                onChange={(event) => setMovieForm((current) => ({ ...current, runtime: event.target.value }))}
                placeholder="时长"
                required
                type="number"
                value={movieForm.runtime}
              />
              <input
                onChange={(event) =>
                  setMovieForm((current) => ({ ...current, posterImage: event.target.value }))
                }
                placeholder="海报地址"
                required
                value={movieForm.posterImage}
              />
              <div className="form-actions">
                <button className="primary" type="submit">
                  {editingMovieId ? "保存修改" : "发布电影"}
                </button>
                <button className="ghost" onClick={resetMovieEditor} type="button">
                  清空表单
                </button>
              </div>
            </form>
          </section>

          <section className="panel admin-panel">
            <div className="admin-panel-head">
              <div>
                <p className="eyebrow">Audit</p>
                <h2>操作日志</h2>
              </div>
              <span className="status-pill">{logLoading ? "加载中" : "实时可查"}</span>
            </div>
            <div className="log-list">
              {logs.length ? (
                logs.map((log) => (
                  <article className="log-card" key={log.id}>
                    <div className="log-top">
                      <strong>{log.userName}</strong>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p>{log.methodName}</p>
                  </article>
                ))
              ) : (
                <p className="muted">当前还没有管理员操作日志。</p>
              )}
            </div>
          </section>
        </section>
      ) : null}

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
                    alt={movie.title}
                    className="movie-poster"
                    loading="lazy"
                    onError={(event) => {
                      (event.target as HTMLImageElement).style.display = "none";
                    }}
                    src={movie.posterImage}
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
                  <button className="primary" onClick={() => void loadMovieDetail(movie.movieId)} type="button">
                    查看详情
                  </button>
                  {user.manager ? (
                    <>
                      <button className="ghost" onClick={() => startEditingMovie(movie)} type="button">
                        编辑
                      </button>
                      <button className="ghost danger" onClick={() => void onDeleteMovie(movie.movieId)} type="button">
                        删除
                      </button>
                    </>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="panel sidebar">
          {selectedMovie ? (
            <section className="detail-column">
              <div className="detail-header">
                <p className="eyebrow">Detail</p>
                {selectedMovie.posterImage ? (
                  <img
                    alt={selectedMovie.title}
                    className="detail-poster"
                    onError={(event) => {
                      (event.target as HTMLImageElement).style.display = "none";
                    }}
                    src={selectedMovie.posterImage}
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
              <p className="muted">
                从左侧选择电影查看详情。管理员可直接在电影卡片上进行编辑和删除，也可以使用 root/root 登录。
              </p>
            </section>
          )}

          {message ? <p className="notice">{message}</p> : null}
        </aside>
      </section>
    </main>
  );
}
