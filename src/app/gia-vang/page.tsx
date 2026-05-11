"use client";
import { useState, useEffect } from "react";
import { RefreshCw, Clock, ShieldCheck, Globe } from "lucide-react";
import GoldChart from "@/app/components/GoldChart"; 
import GoldCard from "@/app/components/GoldCard";   
import GoldTicker from "@/app/components/GoldTicker"; 

export default function GoldPricePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(""); // Cho giá trong nước
  const [worldTime, setWorldTime] = useState("");   // Cho giá thế giới (Chỉ nhảy khi cập nhật)

  const fetchGoldPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/gold");
      const result = await response.json();
      setData(result.data || []);
      
      const now = new Date();
      const timeString = now.toLocaleTimeString("vi-VN");
      const fullDateString = now.toLocaleString("vi-VN", {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      // Cập nhật thời gian đồng bộ đúng lúc lấy dữ liệu thành công
      setLastUpdate(timeString);
      setWorldTime(fullDateString);
      
    } catch (error) {
      console.error("Lỗi Fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchGoldPrices();

    // Cứ mỗi 5 phút tự động làm mới dữ liệu và nhảy thời gian 1 lần
    const apiInterval = setInterval(fetchGoldPrices, 300000); 

    return () => clearInterval(apiInterval);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <ShieldCheck size={20} />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Hệ thống tra cứu Ultra-DL</span>
            </div>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Thị Trường Vàng</h1>
          </div>

          <button 
            onClick={fetchGoldPrices}
            disabled={loading}
            className="group flex items-center gap-3 bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black hover:bg-white transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-yellow-500/10"
          >
            <RefreshCw className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
            LÀM MỚI DỮ LIỆU
          </button>
        </div>

        {/* --- PHẦN 1: GIÁ VÀNG THẾ GIỚI --- */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-blue-400">Thế Giới - XAU/USD</h2>
              <div className="hidden md:block h-px w-20 bg-blue-400/20"></div>
            </div>

            {/* Thời gian này giờ chỉ nhảy khi bạn bấm nút hoặc sau mỗi 5 phút fetch xong */}
            <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full">
              <Globe size={16} className="text-blue-400" />
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Dữ liệu khớp lúc:</span>
              <span className="text-xs font-mono font-bold text-blue-400">
                {worldTime || "--:--:-- --/--/----"}
              </span>
            </div>
          </div>

          <GoldTicker />
          <GoldChart />
        </section>

        {/* --- PHẦN 2: GIÁ VÀNG TRONG NƯỚC --- */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
               <h2 className="text-2xl font-black italic uppercase tracking-tight text-yellow-500">Trong Nước (VNĐ)</h2>
               <div className="hidden md:block h-px w-20 bg-yellow-500/20"></div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <Clock size={16} className="text-gray-500" />
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">Niêm yết lúc:</span>
              <span className="text-xs font-mono font-bold text-white">
                {lastUpdate || "--:--:--"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.length > 0 ? (
              data.map((item, idx) => <GoldCard key={idx} item={item} />)
            ) : (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-44 bg-white/5 animate-pulse rounded-[35px]" />
              ))
            )}
          </div>
        </section>

        <div className="mt-20 text-center text-gray-600 text-[10px] border-t border-white/5 pt-10 uppercase tracking-[0.4em]">
          <p className="mb-2">Dữ liệu được cập nhật tự động từ hệ thống Ultra-DL</p>
        </div>
      </div>
    </div>
  );
}