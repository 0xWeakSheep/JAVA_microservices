"use client";

import { useState } from "react";
import { authApi } from "../../lib/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
  onSwitchMode: () => void;
}

// SVG Icons
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const response = await authApi.login(username, password);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        window.location.reload();
      } else {
        await authApi.register(username, password, email);
        onSwitchMode();
        setError("注册成功，请登录");
      }
    } catch (err: any) {
      setError(err.message || (mode === "login" ? "登录失败" : "注册失败"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <CloseIcon />
        </button>

        <div className="modal-header">
          <h2>{mode === "login" ? "欢迎回来" : "创建账号"}</h2>
          <p className="modal-subtitle">
            {mode === "login" ? "登录你的 Cuit影评 账号" : "加入 Cuit影评 社区"}
          </p>
        </div>

        {error && (
          <div className={error.includes("成功") ? "success-message" : "error-message"}>
            {error.includes("成功") ? <CheckIcon /> : <AlertIcon />}
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                zIndex: 1
              }}>
                <UserIcon />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={mode === "login" ? "请输入用户名" : "设置用户名"}
                required
                style={{ paddingLeft: "48px" }}
              />
            </div>
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label>邮箱</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  zIndex: 1
                }}>
                  <MailIcon />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入邮箱地址"
                  required
                  style={{ paddingLeft: "48px" }}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>密码</label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                zIndex: 1
              }}>
                <LockIcon />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "login" ? "请输入密码" : "设置密码"}
                required
                style={{ paddingLeft: "48px" }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" style={{ width: "18px", height: "18px", borderWidth: "2px", marginRight: "8px" }} />
                请稍候...
              </>
            ) : (
              mode === "login" ? "登录" : "注册"
            )}
          </button>
        </form>

        <div className="modal-footer">
          {mode === "login" ? (
            <>
              还没有账号？<a onClick={onSwitchMode}>立即注册</a>
            </>
          ) : (
            <>
              已有账号？<a onClick={onSwitchMode}>立即登录</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
