import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movies Control Room",
  description: "Next.js frontend for the movies service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
