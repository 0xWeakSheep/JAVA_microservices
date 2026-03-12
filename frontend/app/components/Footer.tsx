import Link from "next/link";

// SVG Icons
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <div className="logo-icon" style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #ca8a04 0%, #a16207 100%)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PlayIcon />
            </div>
            Cuit<span>影评</span>
          </Link>
          <p className="footer-desc">
            发现好电影，分享你的观点。我们致力于为影迷打造一个专业、优质的电影评论社区。
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Twitter">
              <TwitterIcon />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" className="social-link" aria-label="GitHub">
              <GithubIcon />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>探索</h4>
          <Link href="/movies">热门电影</Link>
          <Link href="/movies">最新上映</Link>
          <Link href="/movies">经典回顾</Link>
          <Link href="/reviews">影评专栏</Link>
        </div>

        <div className="footer-column">
          <h4>社区</h4>
          <Link href="/community">讨论区</Link>
          <Link href="/reviews">影评人</Link>
          <Link href="/community">活动</Link>
          <Link href="/movies">排行榜</Link>
        </div>

        <div className="footer-column">
          <h4>关于</h4>
          <Link href="/about">关于我们</Link>
          <Link href="/about">联系我们</Link>
          <Link href="/about">隐私政策</Link>
          <Link href="/about">使用条款</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {currentYear} Cuit影评. All rights reserved.
        </p>
        <div className="footer-links">
          <Link href="/about">隐私政策</Link>
          <Link href="/about">服务条款</Link>
          <Link href="/about">Cookie 设置</Link>
        </div>
      </div>
    </footer>
  );
}
