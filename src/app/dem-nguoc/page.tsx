"use client";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, Timer as TimerIcon, Zap, Clock, ChevronUp, ChevronDown } from "lucide-react";

export default function SmartTimer() {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // State cho bộ chọn 3 cột
  const [h, setH] = useState(0);
  const [m, setM] = useState(2);
  const [s, setS] = useState(0);

  const [endTime, setEndTime] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
  }, []);

  // Cập nhật secondsLeft ngay khi người dùng thay đổi bộ chọn (không cần bấm nút bắt đầu)
  useEffect(() => {
    if (!isActive) {
      const totalSecs = h * 3600 + m * 60 + s;
      setSecondsLeft(totalSecs);
      setTotalTime(totalSecs);
    }
  }, [h, m, s, isActive]);

  useEffect(() => {
    if (secondsLeft > 0) {
      const now = new Date();
      const end = new Date(now.getTime() + secondsLeft * 1000);
      setEndTime(end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
    } else {
      setEndTime("");
    }
  }, [secondsLeft, isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      audioRef.current?.play().catch(() => {});
      if (typeof window !== "undefined" && window.navigator.vibrate) {
        window.navigator.vibrate([500, 200, 500]);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  // Khi bấm mốc thời gian nhanh, cập nhật lại cả bộ chọn 3 cột
  const setQuickValue = (mins: number) => {
    setIsActive(false);
    setH(Math.floor(mins / 60));
    setM(mins % 60);
    setS(0);
  };

  const togglePause = () => {
    if (secondsLeft > 0) setIsActive(!isActive);
  };
  
  const reset = () => {
    setIsActive(false);
    setH(0);
    setM(0);
    setS(0);
    setSecondsLeft(0);
    setTotalTime(0);
  };

  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const percentage = totalTime > 0 ? (secondsLeft / totalTime) : 0;
  const strokeDashoffset = circumference - (percentage * circumference);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return hrs > 0 
      ? `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="min-h-screen bg-[#050505] text-white py-6 md:py-10 px-4 flex flex-col items-center justify-center font-sans overflow-x-hidden">
      <div className="w-full max-w-md space-y-6 md:space-y-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest uppercase mx-auto">
          <Zap size={12} fill="currentColor" /> Hẹn Giờ Tập Trung
        </div>

        {/* Đồng hồ số và Vòng tròn */}
        <div className="relative flex items-center justify-center scale-90 sm:scale-100 lg:scale-110 transition-transform">
          <svg className="w-72 h-72 md:w-80 md:h-80 transform -rotate-90">
            <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
            <circle
              cx="50%" cy="50%" r={radius}
              stroke="currentColor" strokeWidth="6" fill="transparent"
              strokeDasharray={circumference}
              style={{ 
                strokeDashoffset: strokeDashoffset, 
                transition: isActive ? "stroke-dashoffset 1s linear" : "stroke-dashoffset 0.4s ease-out"
              }}
              strokeLinecap="round"
              className={`${percentage < 0.1 && secondsLeft > 0 ? 'text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-blue-500'} transition-colors duration-500`}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-6xl md:text-7xl font-black font-mono tracking-tighter transition-all ${isActive ? 'scale-105 text-white' : 'scale-100 text-gray-200'}`}>
              {formatTime(secondsLeft)}
            </span>
            
            {endTime && (
              <div className="flex items-center gap-1.5 mt-2 text-blue-400/80 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-blue-500/5 px-3 py-0.5 rounded-full border border-blue-500/10">
                <Clock size={12} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Sẽ xong lúc {endTime}</span>
              </div>
            )}

            <span className={`text-[10px] uppercase tracking-[0.3em] font-black mt-4 transition-opacity ${isActive ? 'text-blue-400 animate-pulse' : 'text-gray-600'}`}>
              {isActive ? "Đang đếm ngược" : "Sẵn sàng"}
            </span>
          </div>
        </div>

        {/* Khu vực chọn thời gian 3 Cột */}
        <div className="bg-[#0f0f12] p-5 md:p-6 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
          <div className="flex items-center justify-center gap-4 sm:gap-8">
            <TimeColumn label="Giờ" value={h} onUp={() => setH((v)=>(v+1)%24)} onDown={() => setH((v)=>(v-1+24)%24)} />
            <span className="text-xl font-black text-gray-800 self-center mb-6">:</span>
            <TimeColumn label="Phút" value={m} onUp={() => setM((v)=>(v+1)%60)} onDown={() => setM((v)=>(v-1+60)%60)} />
            <span className="text-xl font-black text-gray-800 self-center mb-6">:</span>
            <TimeColumn label="Giây" value={s} onUp={() => setS((v)=>(v+1)%60)} onDown={() => setS((v)=>(v-1+60)%60)} />
          </div>

          {/* Grid lựa chọn nhanh - Khôi phục đầy đủ các mốc của bạn */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[2, 5, 10, 15, 20, 25, 30, 45, 60, 90].map((mVal) => (
              <button
                key={mVal}
                onClick={() => setQuickValue(mVal)}
                className={`py-2.5 rounded-xl text-[10px] font-black transition-all border ${totalTime === mVal*60 ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'}`}
              >
                {mVal} Phút
              </button>
            ))}
          </div>
        </div>

        {/* Nút Play Chính */}
        <div className="flex items-center justify-center gap-8 md:gap-10 pt-2">
          <button onClick={reset} className="flex flex-col items-center gap-2 group">
            <div className="p-4 bg-white/5 rounded-full group-hover:bg-red-500/10 group-hover:text-red-500 transition-all border border-white/5">
                <RotateCcw size={22} />
            </div>
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Đặt lại</span>
          </button>

          <button
            onClick={togglePause}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${
              isActive ? "bg-white text-black" : "bg-blue-600 text-white shadow-blue-600/30"
            } ${secondsLeft === 0 ? "opacity-20 pointer-events-none scale-90" : "hover:scale-110 active:scale-95"}`}
          >
            {isActive ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
          </button>

          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="p-4 bg-white/5 rounded-full border border-white/5">
                <Volume2 size={22} />
            </div>
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Âm báo</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[9px] text-gray-700 font-bold uppercase tracking-[0.2em] pt-4 pb-10">
            <TimerIcon size={12} />
            <span>Hệ thống đếm ngược 2026</span>
        </div>
      </div>
    </div>
  );
}

// Component phụ cho cột thời gian
function TimeColumn({ label, value, onUp, onDown }: any) {
    return (
      <div className="flex flex-col items-center">
        <button onClick={onUp} className="p-1 hover:text-blue-400 transition-colors active:scale-125">
          <ChevronUp size={20}/>
        </button>
        <div className="flex flex-col items-center bg-white/5 px-3 py-2 rounded-2xl border border-white/5 min-w-[65px] sm:min-w-[75px]">
          <span className="text-2xl sm:text-3xl font-black font-mono leading-none">{value.toString().padStart(2, "0")}</span>
          <span className="text-[8px] uppercase font-bold text-gray-500 tracking-tighter mt-1">{label}</span>
        </div>
        <button onClick={onDown} className="p-1 hover:text-blue-400 transition-colors active:scale-125">
          <ChevronDown size={20}/>
        </button>
      </div>
    );
}