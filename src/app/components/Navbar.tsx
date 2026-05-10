"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Video, Clock, TrendingUp, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [time, setTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="bg-[#0f172a] text-white sticky top-0 z-50 shadow-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        {/* Container chính: justify-between trên mobile, justify-center trên desktop */}
        <div className="flex justify-between md:justify-center items-center h-20 gap-12">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-black text-2xl text-blue-400 tracking-tighter hover:opacity-80 transition">
            <div className="bg-blue-600 p-1.5 rounded-lg">
                <Video className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">ULTRA-DL</span>
          </Link>

          {/* Desktop Menu - Đã căn giữa */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center space-x-8 text-sm font-bold uppercase tracking-widest text-gray-400">
                <Link href="/" className="hover:text-blue-400 flex items-center gap-2 transition-all hover:scale-105">
                <Video size={16} /> Tải Video
                </Link>
                <Link href="/dem-nguoc" className="hover:text-blue-400 flex items-center gap-2 transition-all hover:scale-105">
                <Clock size={16} /> Đếm ngược
                </Link>
                <Link href="/gia-vang" className="hover:text-blue-400 flex items-center gap-2 transition-all hover:scale-105">
                <TrendingUp size={16} /> Giá Vàng
                </Link>
            </div>
            
            {/* Đồng hồ số */}
            <div className="bg-blue-500/10 px-5 py-2 rounded-2xl border border-blue-500/20 font-mono text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <span className="text-[10px] block leading-none text-blue-300/50 mb-0.5 uppercase font-sans font-black">Hệ thống</span>
              {time.toLocaleTimeString('vi-VN')}
            </div>
          </div>

          {/* Mobile Toggle (Giữ ở bên phải khi ở màn hình nhỏ) */}
          <div className="md:hidden flex items-center">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-white/5 rounded-xl transition"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Cũng căn giữa text) */}
      {isOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-white/5 pb-8 px-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 text-center">
          <Link href="/" className="block py-4 text-lg font-bold border-b border-white/5 uppercase tracking-widest">Tải Video</Link>
          <Link href="/dem-nguoc" className="block py-4 text-lg font-bold border-b border-white/5 uppercase tracking-widest">Đếm ngược</Link>
          <Link href="/gia-vang" className="block py-4 text-lg font-bold border-b border-white/5 uppercase tracking-widest">Giá Vàng</Link>
          <div className="text-blue-400 font-mono pt-4 text-xl">
             🕒 {time.toLocaleTimeString('vi-VN')}
          </div>
        </div>
      )}
    </nav>
  );
}