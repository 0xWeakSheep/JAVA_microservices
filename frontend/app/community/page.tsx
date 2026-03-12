"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import { useState } from "react";

// SVG Icons
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MessageCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

// Discussion topics
const discussions = [
  {
    id: 1,
    title: "诺兰的导演风格分析",
    author: "MovieLover",
    replies: 156,
    views: "2.3K",
    lastReply: "2小时前",
    tag: "深度讨论",
  },
  {
    id: 2,
    title: "2024年最值得期待的科幻电影",
    author: "SciFiFan",
    replies: 89,
    views: "1.8K",
    lastReply: "4小时前",
    tag: "热门话题",
  },
  {
    id: 3,
    title: "经典电影重映的意义",
    author: "Cinephile",
    replies: 67,
    views: "1.2K",
    lastReply: "昨天",
    tag: "影评交流",
  },
  {
    id: 4,
    title: "独立电影推荐专区",
    author: "FilmBuff",
    replies: 234,
    views: "4.5K",
    lastReply: "昨天",
    tag: "推荐",
  },
  {
    id: 5,
    title: "电影配乐的重要性",
    author: "MusicLover",
    replies: 45,
    views: "890",
    lastReply: "3天前",
    tag: "深度讨论",
  },
];

// Events
const events = [
  {
    id: 1,
    title: "月度观影会",
    date: "1月20日",
    time: "19:00",
    participants: 128,
    type: "线上活动",
  },
  {
    id: 2,
    title: "导演主题周：王家卫",
    date: "1月25日",
    time: "全天",
    participants: 256,
    type: "专题活动",
  },
  {
    id: 3,
    title: "新年影评大赛",
    date: "2月1日",
    time: "截止",
    participants: 512,
    type: "比赛",
  },
];

export default function CommunityPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

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
              社区
            </span>
            <h1 className="page-title">影迷社区</h1>
            <p className="page-subtitle">与志同道合的影迷交流心得</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="community-section">
          <div className="section">
            <div className="community-grid">
              <div className="community-stat-card">
                <div className="community-stat-icon">
                  <UsersIcon />
                </div>
                <div className="community-stat-value">10,000+</div>
                <div className="community-stat-label">社区成员</div>
              </div>
              <div className="community-stat-card">
                <div className="community-stat-icon">
                  <MessageCircleIcon />
                </div>
                <div className="community-stat-value">5,000+</div>
                <div className="community-stat-label">讨论话题</div>
              </div>
              <div className="community-stat-card">
                <div className="community-stat-icon">
                  <CalendarIcon />
                </div>
                <div className="community-stat-value">50+</div>
                <div className="community-stat-label">月度活动</div>
              </div>
              <div className="community-stat-card">
                <div className="community-stat-icon">
                  <TrophyIcon />
                </div>
                <div className="community-stat-value">100+</div>
                <div className="community-stat-label">优秀影评人</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <section className="section">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
            {/* Discussions */}
            <div>
              <div className="section-header" style={{ marginBottom: "24px" }}>
                <div className="section-title-wrapper">
                  <span className="section-label">讨论</span>
                  <h2 className="section-title" style={{ fontSize: "24px" }}>热门话题</h2>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {discussions.map((topic) => (
                  <div
                    key={topic.id}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "16px",
                      padding: "24px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-glow)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-subtle)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <span
                        style={{
                          background: "rgba(202, 138, 4, 0.1)",
                          color: "var(--accent-gold)",
                          padding: "4px 12px",
                          borderRadius: "100px",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {topic.tag}
                      </span>
                      <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>{topic.lastReply}</span>
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>{topic.title}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                      <span>by {topic.author}</span>
                      <div style={{ display: "flex", gap: "16px" }}>
                        <span>{topic.replies} 回复</span>
                        <span>{topic.views} 浏览</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events */}
            <div>
              <div className="section-header" style={{ marginBottom: "24px" }}>
                <div className="section-title-wrapper">
                  <span className="section-label">活动</span>
                  <h2 className="section-title" style={{ fontSize: "24px" }}>近期活动</h2>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {events.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "16px",
                      padding: "20px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <span
                        style={{
                          background: "var(--bg-glass)",
                          color: "var(--text-secondary)",
                          padding: "4px 12px",
                          borderRadius: "100px",
                          fontSize: "12px",
                        }}
                      >
                        {event.type}
                      </span>
                    </div>
                    <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>{event.title}</h4>
                    <div style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "12px" }}>
                      <div>{event.date} · {event.time}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "13px" }}>
                      <UsersIcon />
                      {event.participants} 人参与
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary btn-full" style={{ marginTop: "24px" }}>
                查看更多活动
              </button>
            </div>
          </div>
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
