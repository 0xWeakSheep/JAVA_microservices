"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { movieApi, reviewApi, type Movie, type Review } from "../../../lib/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AuthModal from "../../components/AuthModal";

// SVG Icons
const PenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const FilmIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = parseInt(params.id as string);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewScore, setReviewScore] = useState(8);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (movieId) {
      loadMovieData();
    }
  }, [movieId]);

  const loadMovieData = async () => {
    try {
      const [movieData, reviewsData] = await Promise.all([
        movieApi.getById(movieId),
        reviewApi.getByMovieId(movieId),
      ]);
      setMovie(movieData);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to load movie data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = localStorage.getItem("user");
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSubmitting(true);
    try {
      await reviewApi.create({
        movieId,
        content: reviewContent,
        score: reviewScore,
      });
      setReviewContent("");
      setShowReviewForm(false);
      loadMovieData(); // 重新加载评论
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />
        <div className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />
        <div className="main-content">
          <div className="empty-state">
            <div className="empty-state-icon">
              <FilmIcon />
            </div>
            <h3>电影不存在</h3>
            <Link href="/movies" className="btn btn-primary">返回电影列表</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />

      <main className="main-content">
        {/* Movie Hero */}
        <section className="movie-hero">
          <div className="movie-hero-content">
            <div className="movie-detail-poster">
              <img src={movie.posterImage} alt={movie.title} />
              <div className="rating-badge">
                <span className="score">{movie.averageScore.toFixed(1)}</span>
                <span className="label">评分</span>
              </div>
            </div>

            <div className="movie-detail-info">
              <h1>{movie.title}</h1>
              <div className="movie-detail-meta">
                <span className="meta-item">
                  {new Date(movie.releaseDate).getFullYear()}
                </span>
                <span className="meta-item">{movie.runtime} 分钟</span>
                <span className="meta-tag">{movie.genre || "剧情"}</span>
              </div>
              <p className="movie-detail-description">{movie.description || "暂无简介"}</p>
              <div className="movie-detail-actions">
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  <PenIcon /> 写影评
                </button>
                <button className="btn btn-outline btn-large">
                  <HeartIcon /> 收藏
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Review Form */}
        {showReviewForm && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "20px",
              padding: "30px"
            }}>
              <h3 style={{ marginBottom: "20px" }}>撰写影评</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="form-group">
                  <label>评分</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={reviewScore}
                      onChange={(e) => setReviewScore(parseFloat(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <span style={{ color: "var(--accent-gold)", fontSize: "20px", fontWeight: 600 }}>
                      {reviewScore.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>影评内容</label>
                  <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="分享你对这部电影的看法..."
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: "15px" }}>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "提交中..." : "提交影评"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">
              影评
              <span style={{
                padding: "6px 14px",
                background: "var(--bg-glass)",
                borderRadius: "20px",
                fontSize: "14px",
                color: "var(--text-muted)",
                marginLeft: "15px"
              }}>
                {reviews.length} 条评论
              </span>
            </h2>
          </div>

          {reviews.length > 0 ? (
            <div className="review-cards">
              {reviews.map((review) => (
                <div key={review.reviewId} className="review-card">
                  <div className="review-header">
                    <div className="reviewer">
                      <div className="reviewer-avatar">
                        {(review.username || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="reviewer-info">
                        <h4>{review.username || "匿名用户"}</h4>
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={{
                      background: "rgba(212, 168, 83, 0.15)",
                      border: "1px solid var(--border-glow)",
                      padding: "8px 16px",
                      borderRadius: "25px",
                      color: "var(--accent-gold)",
                      fontWeight: 600,
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <StarIcon /> {review.score.toFixed(1)}
                    </div>
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: 1.8 }}>
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <PenIcon />
              </div>
              <h3>暂无评论</h3>
              <p>成为第一个评论这部电影的人吧！</p>
            </div>
          )}
        </section>
      </main>

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
