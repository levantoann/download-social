"use client";
// 1. Dùng react-icons cho các logo mạng xã hội (Chắc chắn không lỗi)
import { FaFacebook, FaGithub, FaEnvelope } from 'react-icons/fa'; 

// 2. Dùng lucide-react cho các icon chức năng
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Cột 1: Giới thiệu */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">ULTRA DOWNLOADER</h3>
          <p className="text-sm leading-relaxed">
            Công cụ tải video đa nền tảng không logo, cập nhật giá vàng trực tuyến 
            và các tiện ích đếm ngược sự kiện quan trọng.
          </p>
        </div>

        {/* Cột 2: Tiện ích nhanh (Giá vàng tóm tắt) */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            GIÁ VÀNG SJC (Tham khảo)
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-700 pb-1">
              <span>Mua vào:</span>
              <span className="text-green-400 font-mono">82.000.000đ</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-1">
              <span>Bán ra:</span>
              <span className="text-red-400 font-mono">84.500.000đ</span>
            </div>
            <p className="italic text-[10px] pt-1">* Cập nhật 2026</p>
          </div>
        </div>

        {/* Cột 3: Liên kết & Social - ĐÃ THAY BẰNG Fa (Font Awesome) */}
        <div className="flex flex-col md:items-end">
          <h3 className="text-white font-semibold mb-4">Kết nối với chúng tôi</h3>
          <div className="flex space-x-4 mb-4">
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:text-[#1877F2] hover:bg-white transition-all">
               <FaFacebook size={20} />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:text-white hover:bg-black transition-all">
               <FaGithub size={20} />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:text-[#EA4335] hover:bg-white transition-all">
               <FaEnvelope size={20} />
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-green-500" /> Chính sách bảo mật
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800 text-center text-xs">
        <p>© {new Date().getFullYear()} Ultra-DL Project. All rights reserved.</p>
      </div>
    </footer>
  );
}