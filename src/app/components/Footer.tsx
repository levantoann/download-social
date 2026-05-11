"use client";

// 1. Dùng react-icons cho các logo mạng xã hội
import { FaFacebook, FaTiktok, FaEnvelope } from 'react-icons/fa'; 

// 2. Dùng lucide-react cho các icon chức năng
import { ShieldCheck, Info, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f0f12] text-slate-400 pt-12 pb-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Cột 1: Giới thiệu */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4 tracking-tighter">ULTRA DOWNLOADER</h3>
          <p className="text-sm leading-relaxed">
            Công cụ tải video TikTok không logo chất lượng cao, hỗ trợ tách nhạc MP3 
            và lưu trữ video trực tiếp về thiết bị hoàn toàn miễn phí. 
            Phát triển trên nền tảng công nghệ mới nhất 2026.
          </p>
        </div>

        {/* Cột 2: Quy định & Cam kết */}
        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
            <ShieldCheck size={18} className="text-blue-500" />
            CAM KẾT DỊCH VỤ
          </h3>
          <ul className="space-y-2 text-xs italic">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
              Không lưu trữ dữ liệu người dùng.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
              Tốc độ tải xuống tối ưu Server VIP.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
              Hỗ trợ tải video HD không Watermark.
            </li>
          </ul>
        </div>

        {/* Cột 3: Liên kết & Social */}
        <div className="flex flex-col md:items-end">
          <h3 className="text-white font-semibold mb-4">Kết nối với chúng tôi</h3>
          <div className="flex space-x-4 mb-4">
            <a href="https://www.facebook.com/LeVanToann" target="_blank" className="p-2.5 bg-slate-800/50 rounded-xl hover:text-[#1877F2] hover:bg-white transition-all duration-300">
               <FaFacebook size={20} />
            </a>
            <a href="https://www.tiktok.com/@lvtoan27_" target="_blank" className="p-2.5 bg-slate-800/50 rounded-xl hover:text-white hover:bg-black transition-all duration-300">
               <FaTiktok size={20} />
            </a>
            <a href="mailto:checkson277@gmail.com" className="p-2.5 bg-slate-800/50 rounded-xl hover:text-[#EA4335] hover:bg-white transition-all duration-300">
               <FaEnvelope size={20} />
            </a>
          </div>
          <div className="flex flex-col md:items-end gap-2 text-[11px] text-slate-500">
            <p className="flex items-center gap-1">
               <Info size={12} /> Hướng dẫn sử dụng
            </p>
            <p className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition-colors">
               <ExternalLink size={12} /> Điều khoản & Chính sách
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-white/5 text-center text-[10px] uppercase tracking-widest text-slate-600">
        <p>© {new Date().getFullYear()} Ultra-DL Project. Giao diện được tối ưu cho năm 2026.</p>
      </div>
    </footer>
  );
}