import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cuit 影评 - 发现好电影，分享你的观点",
  description: "Cuit影评是一个专注于电影评论与分享的社区。发现最新热门电影，阅读专业影评，与志同道合的影迷交流心得。",
  keywords: "电影,影评,电影评论,电影推荐,电影社区,影评人",
  authors: [{ name: "Cuit Movies" }],
  openGraph: {
    title: "Cuit 影评 - 发现好电影，分享你的观点",
    description: "Cuit影评是一个专注于电影评论与分享的社区",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
