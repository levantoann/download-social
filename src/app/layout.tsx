import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google"; // Đổi sang font hỗ trợ tiếng Việt tốt hơn
import "./globals.css";
import Navbar from "@/app/components/Navbar"; 
import Footer from "@/app/components/Footer";

// Font cho văn bản chính (thay cho Geist Sans)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"], // Hỗ trợ tiếng Việt 100%
  display: "swap",
});

// Font cho con số và tiêu đề (thay cho Geist Mono)
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin", "vietnamese"], // Hỗ trợ tiếng Việt 100%
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ultra Downloader - Tải Video & Tiện Ích",
  description: "Công cụ tải video đa nền tảng, xem giá vàng và đếm ngược thời gian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-white font-sans">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}