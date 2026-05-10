"use client";
import { useEffect, useRef } from "react";

export default function GoldTicker() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": "TVC:GOLD",
      "width": "100%",
      "colorTheme": "dark",
      "isTransparent": true,
      "locale": "vi"
    });
    container.current.appendChild(script);
  }, []);

  return (
    <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-[35px] mb-6 shadow-2xl overflow-hidden min-h-[120px] flex items-center">
      <div ref={container} className="w-full"></div>
    </div>
  );
}