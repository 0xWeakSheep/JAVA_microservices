"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { movieApi, reviewApi, type Movie, type Review } from "../lib/api";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";

// SVG Icons
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const MessageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const TrendingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const FilmIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" />
    <line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const AwardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// Categories data
const categories = [
  { name: "剧情", count: "2,341", icon: "🎭" },
  { name: "科幻", count: "1,892", icon: "🚀" },
  { name: "动作", count: "1,567", icon: "⚡" },
  { name: "爱情", count: "1,234", icon: "💕" },
  { name: "悬疑", count: "987", icon: "🔍" },
  { name: "动画", count: "856", icon: "✨" },
];

// Top reviewers data
const topReviewers = [
  { name: "MovieLover", role: "资深影评人", reviews: 328, followers: "12.5K", avatar: "M" },
  { name: "SciFiFan", role: "科幻达人", reviews: 256, followers: "8.2K", avatar: "S" },
  { name: "Cinephile", role: "电影发烧友", reviews: 189, followers: "6.8K", avatar: "C" },
  { name: "FilmBuff", role: "独立影评人", reviews: 167, followers: "5.4K", avatar: "F" },
  { name: "CinemaKing", role: "影评博主", reviews: 145, followers: "4.9K", avatar: "K" },
];

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [moviesData, reviewsData] = await Promise.all([
        movieApi.getAll(),
        reviewApi.getAll(),
      ]);
      setMovies(moviesData.slice(0, 8));
      setReviews(reviewsData.slice(0, 6));
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openLogin = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid">
          <div className="hero-text">
            <div className="hero-badge">
              <TrendingIcon />
              <span>本周新增 500+ 影评</span>
            </div>
            <h1 className="hero-title">
              发现<span className="gradient-text">好电影</span>
              <br />
              分享你的观点
            </h1>
            <p className="hero-description">
              Cuit影评是一个专注于电影评论与分享的社区。在这里，你可以发现最新热门电影，
              阅读专业影评，与志同道合的影迷交流心得。
            </p>
            <div className="hero-buttons">
              <Link href="/movies" className="btn btn-primary btn-large">
                <PlayIcon />
                浏览电影
              </Link>
              <button onClick={openRegister} className="btn btn-outline btn-large">
                加入社区
              </button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">10K+</span>
                <span className="hero-stat-label">收录电影</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">50K+</span>
                <span className="hero-stat-label">用户评论</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">100K+</span>
                <span className="hero-stat-label">活跃用户</span>
              </div>
            </div>
          </div>

          <div className="featured-movie">
            <div className="featured-card">
              <div className="featured-poster">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/1/19/Shawshank_Redemption_ver2.jpg"
                  alt="肖申克的救赎"
                />
                <div className="featured-overlay" />
                <div className="featured-rating">
                  <span className="score">9.7</span>
                  <span className="label">评分</span>
                </div>
              </div>
              <div className="featured-info">
                <h3>肖申克的救赎</h3>
                <div className="featured-meta">
                  <span>1994</span>
                  <span>剧情 / 犯罪</span>
                  <span>142分钟</span>
                </div>
                <p className="featured-desc">
                  一个银行家被错误指控谋杀妻子及其情人，被判处终身监禁。在肖申克监狱中，他与一位老囚犯建立了深厚的友谊...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="section-header">
          <div className="section-title-wrapper">
            <span className="section-label">探索</span>
            <h2 className="section-title">浏览分类</h2>
          </div>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link href={`/movies?genre=${cat.name}`} key={cat.name} className="category-card">
              <div className="category-icon">{cat.icon}</div>
              <div className="category-name">{cat.name}</div>
              <div className="category-count">{cat.count} 部电影</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Movies Section */}
      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="section-header">
          <div className="section-title-wrapper">
            <span className="section-label">精选</span>
            <h2 className="section-title">热门电影</h2>
            <p className="section-description">本周最受欢迎的影片，发现你的下一部心头好</p>
          </div>
          <Link href="/movies" className="view-all">
            查看全部
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner" />
          </div>
        ) : (
          <div className="movie-grid">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <Link href={`/movies/${movie.movieId}`} key={movie.movieId} className="movie-card">
                  <div className="movie-poster">
                    <img src={movie.posterImage} alt={movie.title} />
                    <div className="movie-overlay">
                      <div className="movie-quick-info">
                        <span>{movie.runtime} 分钟</span>
                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      <span className="movie-genre">{movie.genre || "剧情"}</span>
                      <span className="movie-score">
                        <StarIcon />
                        {movie.averageScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Default movies when API returns empty
              <>
                {[
                  { id: 1, title: "肖申克的救赎", poster: "https://upload.wikimedia.org/wikipedia/en/1/19/Shawshank_Redemption_ver2.jpg", year: 1994, runtime: 142, genre: "剧情 / 犯罪", score: 9.7 },
                  { id: 2, title: "低俗小说", poster: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg", year: 1994, runtime: 154, genre: "剧情 / 犯罪", score: 8.9 },
                  { id: 3, title: "星际穿越", poster: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interpreter_ver5.jpg", year: 2014, runtime: 169, genre: "科幻 / 冒险", score: 9.4 },
                  { id: 4, title: "沙丘", poster: "https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg", year: 2021, runtime: 155, genre: "科幻 / 冒险", score: 8.5 },
                  { id: 5, title: "教父", poster: "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg", year: 1972, runtime: 175, genre: "剧情 / 犯罪", score: 9.3 },
                  { id: 6, title: "黑暗骑士", poster: "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg", year: 2008, runtime: 152, genre: "动作 / 犯罪", score: 9.0 },
                  { id: 7, title: "寄生虫", poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png", year: 2019, runtime: 132, genre: "剧情 / 惊悚", score: 8.6 },
                  { id: 8, title: "千与千寻", poster: "https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png", year: 2001, runtime: 125, genre: "动画 / 奇幻", score: 8.9 },
                ].map((movie) => (
                  <Link href={`/movies/${movie.id}`} key={movie.id} className="movie-card">
                    <div className="movie-poster">
                      <img src={movie.poster} alt={movie.title} />
                      <div className="movie-overlay">
                        <div className="movie-quick-info">
                          <span>{movie.runtime} 分钟</span>
                          <span>{movie.year}</span>
                        </div>
                      </div>
                    </div>
                    <div className="movie-info">
                      <h3 className="movie-title">{movie.title}</h3>
                      <div className="movie-meta">
                        <span className="movie-genre">{movie.genre}</span>
                        <span className="movie-score">
                          <StarIcon />
                          {movie.score}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section className="section">
        <div className="section-header">
          <div className="section-title-wrapper">
            <span className="section-label">社区</span>
            <h2 className="section-title">精选影评</h2>
            <p className="section-description">来自资深影迷的深度影评，发现不一样的视角</p>
          </div>
          <Link href="/reviews" className="view-all">
            查看全部
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

        <div className="review-grid">
          {[
            {
              id: 1,
              name: "MovieLover",
              role: "资深影评人",
              avatar: "M",
              movie: "肖申克的救赎",
              rating: 9.5,
              content: "这是一部关于希望的电影。即使在最黑暗的地方，希望也能让人坚持下去。蒂姆·罗宾斯和摩根·弗里曼的表演堪称完美，导演对细节的把控令人叹服。每次重看都有新的感悟，这正是一部经典电影的魅力所在。",
              likes: 256,
              comments: 42,
              time: "2小时前",
              featured: true,
            },
            {
              id: 2,
              name: "SciFiFan",
              role: "科幻达人",
              avatar: "S",
              movie: "星际穿越",
              rating: 9.0,
              content: "诺兰再次证明了他是这个时代最伟大的导演之一。汉斯·季默的配乐简直是神来之笔，配合视觉效果，让人仿佛真的置身于浩瀚宇宙之中。影片对时间、空间和爱的探讨令人深思。",
              likes: 189,
              comments: 28,
              time: "5小时前",
              featured: false,
            },
            {
              id: 3,
              name: "Cinephile",
              role: "电影发烧友",
              avatar: "C",
              movie: "沙丘",
              rating: 8.5,
              content: "维伦纽瓦成功地将赫伯特的宏大世界观搬上了大银幕。每一帧都是壁纸级别的视觉享受，配乐和音效的配合营造出独特的氛围。甜茶的表演也让人眼前一亮。",
              likes: 342,
              comments: 56,
              time: "昨天",
              featured: true,
            },
          ].map((review) => (
            <div key={review.id} className={`review-card ${review.featured ? "featured" : ""}`}>
              <div className="review-header">
                <div className="reviewer">
                  <div className="reviewer-avatar">{review.avatar}</div>
                  <div className="reviewer-info">
                    <h4>{review.name}</h4>
                    <span>{review.role}</span>
                  </div>
                </div>
                <div className="review-badge">
                  <StarIcon />
                  {review.rating}
                </div>
              </div>
              <div className="review-movie">《{review.movie}》</div>
              <p className="review-content">{review.content}</p>
              <div className="review-footer">
                <span className="review-date">{review.time}</span>
                <div className="review-actions">
                  <span className="review-action">
                    <HeartIcon />
                    {review.likes}
                  </span>
                  <span className="review-action">
                    <MessageIcon />
                    {review.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="community-section">
        <div className="section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <span className="section-label">社区</span>
              <h2 className="section-title">加入我们的社区</h2>
              <p className="section-description">与全球影迷一起分享观影体验</p>
            </div>
          </div>

          <div className="community-grid">
            <div className="community-stat-card">
              <div className="community-stat-icon">
                <FilmIcon />
              </div>
              <div className="community-stat-value">10,000+</div>
              <div className="community-stat-label">收录电影</div>
            </div>
            <div className="community-stat-card">
              <div className="community-stat-icon">
                <UsersIcon />
              </div>
              <div className="community-stat-value">100,000+</div>
              <div className="community-stat-label">活跃用户</div>
            </div>
            <div className="community-stat-card">
              <div className="community-stat-icon">
                <AwardIcon />
              </div>
              <div className="community-stat-value">50,000+</div>
              <div className="community-stat-label">优质影评</div>
            </div>
            <div className="community-stat-card">
              <div className="community-stat-icon">
                <ClockIcon />
              </div>
              <div className="community-stat-value">24/7</div>
              <div className="community-stat-label">实时更新</div>
            </div>
          </div>

          <div className="section-header" style={{ marginTop: "80px" }}>
            <div className="section-title-wrapper">
              <span className="section-label">达人</span>
              <h2 className="section-title">热门影评人</h2>
              <p className="section-description">关注这些优秀的影评人，获取更多精彩内容</p>
            </div>
          </div>

          <div className="top-reviewers">
            {topReviewers.map((reviewer) => (
              <div key={reviewer.name} className="top-reviewer-card">
                <div className="top-reviewer-avatar">{reviewer.avatar}</div>
                <div className="top-reviewer-name">{reviewer.name}</div>
                <div className="top-reviewer-role">{reviewer.role}</div>
                <div className="top-reviewer-stats">
                  <span>{reviewer.reviews} 影评</span>
                  <span>{reviewer.followers} 粉丝</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card">
          <h2 className="cta-title">准备好加入了吗？</h2>
          <p className="cta-description">
            成为 Cuit 影评社区的一员，与全球影迷分享你的观影体验
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={openRegister} className="btn btn-primary btn-large">
              免费注册
            </button>
            <Link href="/movies" className="btn btn-outline btn-large">
              先逛逛
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === "login" ? "register" : "login")}
      />
    </div>
  );
}
