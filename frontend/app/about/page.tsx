"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import { useState } from "react";

// SVG Icons
const TargetIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const HeartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ZapIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// Team members
const team = [
  { name: "张明", role: "创始人", avatar: "张" },
  { name: "李华", role: "产品总监", avatar: "李" },
  { name: "王芳", role: "技术负责人", avatar: "王" },
  { name: "陈伟", role: "运营经理", avatar: "陈" },
];

// Values
const values = [
  {
    icon: <TargetIcon />,
    title: "专业",
    description: "我们致力于提供最专业、最有深度的电影评论和分析",
  },
  {
    icon: <HeartIcon />,
    title: "热爱",
    description: "每一篇影评都来自对电影的真挚热爱",
  },
  {
    icon: <ZapIcon />,
    title: "创新",
    description: "不断探索新的观影体验和社区互动方式",
  },
  {
    icon: <ShieldIcon />,
    title: "可信",
    description: "坚持独立客观的立场，打造值得信赖的影评平台",
  },
];

export default function AboutPage() {
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
              关于我们
            </span>
            <h1 className="page-title">关于 Cuit 影评</h1>
            <p className="page-subtitle">了解我们的故事和使命</p>
          </div>
        </div>

        {/* About Content */}
        <section className="section">
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "24px",
              padding: "48px",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                marginBottom: "24px",
                color: "var(--accent-gold)",
              }}
            >
              Cuit 影评
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.9,
                marginBottom: "24px",
                fontSize: "16px",
              }}
            >
              Cuit影评是一个专注于电影评论与分享的社区。我们致力于为影迷打造一个专业、
              友好的交流平台，让每一个人都能发现好电影，分享自己的观影心得。
            </p>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.9,
                marginBottom: "32px",
                fontSize: "16px",
              }}
            >
              自创立以来，我们已经汇聚了超过10万名电影爱好者，累计发布了5万余篇优质影评。
              我们相信，每一部电影都值得被认真对待，每一个观点都值得被倾听。
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "24px",
                marginTop: "48px",
                paddingTop: "48px",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <div>
                <div style={{ fontSize: "36px", fontWeight: 700, color: "var(--accent-gold)", marginBottom: "8px" }}>
                  2023
                </div>
                <div style={{ color: "var(--text-muted)" }}>成立年份</div>
              </div>
              <div>
                <div style={{ fontSize: "36px", fontWeight: 700, color: "var(--accent-gold)", marginBottom: "8px" }}>
                  100K+
                </div>
                <div style={{ color: "var(--text-muted)" }}>社区成员</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section" style={{ background: "var(--bg-secondary)" }}>
          <div className="section-header">
            <div className="section-title-wrapper">
              <span className="section-label">价值观</span>
              <h2 className="section-title">我们的理念</h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
            }}
          >
            {values.map((value) => (
              <div
                key={value.title}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "20px",
                  padding: "32px 24px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-glow)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    color: "var(--accent-gold)",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {value.icon}
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px" }}>
                  {value.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.7 }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <span className="section-label">团队</span>
              <h2 className="section-title">核心团队</h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
            }}
          >
            {team.map((member) => (
              <div
                key={member.name}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "20px",
                  padding: "32px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-dark) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "var(--bg-primary)",
                  }}
                >
                  {member.avatar}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>
                  {member.name}
                </h3>
                <p style={{ color: "var(--accent-gold)", fontSize: "14px" }}>{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="section" style={{ background: "var(--bg-secondary)" }}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "24px",
              padding: "48px",
              maxWidth: "700px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                marginBottom: "16px",
              }}
            >
              联系我们
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "32px",
              }}
            >
              有任何问题或建议？我们很乐意听到你的声音
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                color: "var(--text-secondary)",
              }}
            >
              <div>邮箱：contact@cuitmovies.com</div>
              <div>地址：某某市某某区某某街道123号</div>
              <div>电话：400-123-4567</div>
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
