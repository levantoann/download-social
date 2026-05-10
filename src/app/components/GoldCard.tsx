"use client";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function GoldCard({ item }: { item: any }) {
  return (
    <div className="bg-[#111] border border-white/5 p-6 rounded-[35px] hover:border-yellow-500/40 transition-all hover:shadow-2xl hover:shadow-yellow-500/5 group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-1">
            {item.company}
          </div>
          <h3 className="text-xl font-black text-gray-200 group-hover:text-white transition-colors">
            {item.type}
          </h3>
        </div>
        <div className="bg-white/5 p-2 rounded-lg text-[10px] font-bold text-gray-500 uppercase">
          {item.time}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-gray-500 text-[10px] font-black uppercase">
            <TrendingUp size={12} className="text-red-500" /> Mua vào
          </div>
          <div className="text-2xl font-mono font-black text-white leading-none">
            {item.buy}
          </div>
        </div>
        <div className="space-y-1 border-l border-white/10 pl-4">
          <div className="flex items-center gap-1 text-gray-500 text-[10px] font-black uppercase">
            <TrendingDown size={12} className="text-green-500" /> Bán ra
          </div>
          <div className="text-2xl font-mono font-black text-white leading-none">
            {item.sell}
          </div>
        </div>
      </div>
    </div>
  );
}