import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google"; 
import "./globals.css";
import Navbar from "@/app/components/Navbar"; 
import Footer from "@/app/components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google'; // Import thư viện GA

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ultra Downloader - Tải Video TikTok Không Logo",
  description: "Công cụ tải video TikTok không logo chất lượng cao, nhanh chóng và miễn phí.",
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
        
        {/* Google Analytics - Tích hợp với Measurement ID của bạn */}
        <GoogleAnalytics gaId="G-G0FZD3SBLD" />
      </body>
    </html>
  );
}