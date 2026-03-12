"use client";

import { useEffect, useState } from "react";
import { reviewApi, type Review } from "../../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";

// SVG Icons
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

const PenIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

// Filter tabs
const filterTabs = [
  { id: "all", label: "全部" },
  { id: "hot", label: "热门" },
  { id: "new", label: "最新" },
  { id: "good", label: "好评" },
];

// Default reviews data
const defaultReviews = [
  {
    reviewId: 1,
    username: "MovieLover",
    movieTitle: "肖申克的救赎",
    score: 9.5,
    content: "这是一部关于希望的电影。即使在最黑暗的地方，希望也能让人坚持下去。蒂姆·罗宾斯和摩根·弗里曼的表演堪称完美，导演对细节的把控令人叹服。每次重看都有新的感悟，这正是一部经典电影的魅力所在。",
    createdAt: "2024-01-15T10:30:00",
    likes: 256,
    comments: 42,
    avatar: "M",
    role: "资深影评人",
    featured: true,
  },
  {
    reviewId: 2,
    username: "SciFiFan",
    movieTitle: "星际穿越",
    score: 9.0,
    content: "诺兰再次证明了他是这个时代最伟大的导演之一。汉斯·季默的配乐简直是神来之笔，配合视觉效果，让人仿佛真的置身于浩瀚宇宙之中。影片对时间、空间和爱的探讨令人深思。",
    createdAt: "2024-01-14T15:20:00",
    likes: 189,
    comments: 28,
    avatar: "S",
    role: "科幻达人",
    featured: false,
  },
  {
    reviewId: 3,
    username: "Cinephile",
    movieTitle: "沙丘",
    score: 8.5,
    content: "维伦纽瓦成功地将赫伯特的宏大世界观搬上了大银幕。每一帧都是壁纸级别的视觉享受，配乐和音效的配合营造出独特的氛围。甜茶的表演也让人眼前一亮。",
    createdAt: "2024-01-13T09:45:00",
    likes: 342,
    comments: 56,
    avatar: "C",
    role: "电影发烧友",
    featured: true,
  },
  {
    reviewId: 4,
    username: "FilmBuff",
    movieTitle: "教父",
    score: 9.8,
    content: "科波拉的杰作，影史最伟大的电影之一。马龙·白兰度的表演令人难忘，影片对权力、家庭和背叛的探讨深刻而细腻。每一个镜头都值得反复品味。",
    createdAt: "2024-01-12T14:10:00",
    likes: 423,
    comments: 67,
    avatar: "F",
    role: "独立影评人",
    featured: true,
  },
  {
    reviewId: 5,
    username: "CinemaKing",
    movieTitle: "低俗小说",
    score: 8.8,
    content: "昆汀·塔伦蒂诺的代表作，非线性叙事的开创性运用。对白精彩绝伦，暴力美学与黑色幽默的完美结合。塞缪尔·杰克逊的圣经背诵段落已经成为经典。",
    createdAt: "2024-01-11T11:30:00",
    likes: 178,
    comments: 31,
    avatar: "K",
    role: "影评博主",
    featured: false,
  },
  {
    reviewId: 6,
    username: "MovieMaven",
    movieTitle: "寄生虫",
    score: 8.7,
    content: "奉俊昊的这部作品巧妙地融合了黑色幽默和社会批判。影片对阶级固化的揭示尖锐而深刻，结局的反转更是让人印象深刻。 worthy of every award it won.",
    createdAt: "2024-01-10T16:45:00",
    likes: 298,
    comments: 45,
    avatar: "M",
    role: "电影学者",
    featured: false,
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await reviewApi.getAll();
      setReviews(data.length > 0 ? data : defaultReviews);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviews(defaultReviews);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // In a real app, you would filter/sort based on the tab
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

      <main className="main-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <span className="section-label" style={{ marginBottom: "16px", display: "inline-block" }}>
              影评社区
            </span>
            <h1 className="page-title">精彩影评</h1>
            <p className="page-subtitle">发现深度影评，分享你的观影心得</p>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-section">
          <div className="filter-content">
            <div className="filter-tabs">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`filter-tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <section className="section">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="review-grid">
              {defaultReviews.map((review) => (
                <div
                  key={review.reviewId}
                  className={`review-card ${review.featured ? "featured" : ""}`}
                >
                  <div className="review-header">
                    <div className="reviewer">
                      <div className="reviewer-avatar">{review.avatar}</div>
                      <div className="reviewer-info">
                        <h4>{review.username}</h4>
                        <span>{review.role}</span>
                      </div>
                    </div>
                    <div className="review-badge">
                      <StarIcon />
                      {review.score.toFixed(1)}
                    </div>
                  </div>

                  <div className="review-movie">《{review.movieTitle}》</div>

                  <p className="review-content">{review.content}</p>

                  <div className="review-footer">
                    <span className="review-date">{formatDate(review.createdAt)}</span>
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
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <PenIcon />
              </div>
              <h3>暂无评论</h3>
              <p>成为第一个评论的人吧！</p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={() =>
          setAuthMode(authMode === "login" ? "register" : "login")
        }
      />
    </div>
  );
}
