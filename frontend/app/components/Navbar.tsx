"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface NavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

// SVG Icons
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const FilmIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const MessageSquareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { href: "/movies", label: "电影" },
    { href: "/reviews", label: "评论" },
    { href: "/community", label: "社区" },
    { href: "/about", label: "关于" },
  ];

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link href="/" className="logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0c0a09" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          Cuit<span>影评</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="nav-actions">
          {/* Search */}
          <form onSubmit={handleSearch} className="search-box">
            <div className="search-input-wrapper">
              <span className="search-icon">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="搜索电影..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Auth Buttons or User Menu */}
          {!user ? (
            <>
              <button className="btn btn-ghost hidden-sm" onClick={onLoginClick}>
                登录
              </button>
              <button className="btn btn-primary" onClick={onRegisterClick}>
                注册
              </button>
            </>
          ) : (
            <div className="user-menu" ref={dropdownRef}>
              <div
                className="user-avatar"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 12px 4px 4px", borderRadius: "100px", width: "auto" }}
              >
                <div style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ca8a04 0%, #a16207 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#0c0a09"
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: "14px", color: "#a8a29e", display: "flex", alignItems: "center" }}>
                  <ChevronDownIcon />
                </span>
              </div>
              <div className={`dropdown-menu ${showDropdown ? "active" : ""}`}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "8px" }}>
                  <div style={{ fontWeight: 600, fontSize: "15px" }}>{user.username}</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{user.email || "user@cuit.com"}</div>
                </div>
                <Link href="/movies" className="dropdown-item">
                  <FilmIcon />
                  电影列表
                </Link>
                <Link href="/reviews" className="dropdown-item">
                  <MessageSquareIcon />
                  我的评论
                </Link>
                <Link href="/profile" className="dropdown-item">
                  <UserIcon />
                  个人中心
                </Link>
                <div className="dropdown-divider" />
                <button onClick={handleLogout} className="dropdown-item" style={{ color: "#ef4444" }}>
                  <LogoutIcon />
                  退出登录
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="btn btn-icon mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{ display: "none" }}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <div className="mobile-menu-links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-menu-link ${pathname === link.href ? "active" : ""}`}
                onClick={() => setShowMobileMenu(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {!user && (
            <div className="mobile-menu-actions">
              <button className="btn btn-outline btn-full" onClick={() => { setShowMobileMenu(false); onLoginClick?.(); }}>
                登录
              </button>
              <button className="btn btn-primary btn-full" onClick={() => { setShowMobileMenu(false); onRegisterClick?.(); }}>
                注册
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .mobile-menu-btn {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }

          .hidden-sm {
            display: none;
          }

          .mobile-menu {
            position: absolute;
            top: 80px;
            left: 16px;
            right: 16px;
            background: linear-gradient(135deg, #1c1917 0%, #0c0a09 100%);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          }

          .mobile-menu-links {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-bottom: 20px;
          }

          .mobile-menu-link {
            padding: 14px 16px;
            color: #a8a29e;
            text-decoration: none;
            font-size: 15px;
            border-radius: 12px;
            transition: all 0.2s ease;
          }

          .mobile-menu-link:hover,
          .mobile-menu-link.active {
            background: rgba(255, 255, 255, 0.05);
            color: #fafaf9;
          }

          .mobile-menu-link.active {
            color: #ca8a04;
          }

          .mobile-menu-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
          }
        }
      `}</style>
    </nav>
  );
}
