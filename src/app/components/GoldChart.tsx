"use client";
import React, { useEffect, useRef } from 'react';

export default function GoldChart() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = ""; 
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "height": "650",
      "symbol": "TVC:GOLD",
      "interval": "5",
      "timezone": "Asia/Ho_Chi_Minh",
      "theme": "dark",
      "style": "1",
      "locale": "vi",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });
    container.current.appendChild(script);
  }, []);

  return (
    <div className="w-full bg-[#0a0a0a] p-1 rounded-[35px] border border-white/5 shadow-2xl overflow-hidden mb-12">
      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#111]">
         <h2 className="text-xs font-black text-yellow-500 uppercase tracking-[0.2em]">
           Biểu đồ vàng thế giới (XAU/USD)
         </h2>
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-gray-500 font-bold uppercase">Live Market</span>
         </div>
      </div>
      <div 
        className="tradingview-widget-container" 
        ref={container} 
        style={{ height: "650px", width: "100%" }} 
      />
    </div>
  );
}