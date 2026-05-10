"use client";

import { useState } from 'react';

import { Download, Search, Video, Music, Loader2, Zap, ShieldCheck, CheckCircle } from 'lucide-react';



export default function Home() {

  const [url, setUrl] = useState('');

  const [videoInfo, setVideoInfo] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [downloading, setDownloading] = useState(false);



  const SHOPEE_LINK = "https://s.shopee.vn/4qCMDS5ean";



  const handleAnalyze = async () => {

    if (!url) return alert("Vui lòng dán link video!");

    setLoading(true);

    setVideoInfo(null);

    try {

      const res = await fetch('/api/analyze', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ url }),

      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setVideoInfo(data);

    } catch (err: any) {

      alert("Lỗi: " + err.message);

    } finally {

      setLoading(false);

    }

  };

  const handleDownload = async (downloadUrl: string, fileName: string, isNoLogo: boolean = false) => {

    if (isNoLogo) {

      window.open(SHOPEE_LINK, '_blank');

    }



    setDownloading(true);

    try {

      /** * LOGIC QUAN TRỌNG:

       * Nếu là link YouTube (vevioz), ta gửi link GỐC (url) cho yt-dlp xử lý.

       * Nếu là link TikTok (tikwm), ta gửi link TRỰC TIẾP (downloadUrl) để proxy tải về.

       */

      const finalUrl = downloadUrl.includes('vevioz.com') ? url : downloadUrl;

      const proxyUrl = `/api/download?url=${encodeURIComponent(finalUrl)}&name=${encodeURIComponent(fileName)}`;

     

      const link = document.createElement('a');

      link.href = proxyUrl;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

    } catch (err) {

      console.error("Lỗi:", err);

      window.open(downloadUrl, '_blank');

    } finally {

      setDownloading(false);

    }

  };



  const showTikTokOption = videoInfo?.isTikTok === true;



  return (

    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans selection:bg-blue-500/30 overflow-x-hidden">

      <div className="max-w-4xl mx-auto">

       

        {/* Header */}

        <div className="text-center mb-8 md:mb-12">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] md:text-[10px] font-black tracking-widest uppercase mb-4">

            <Zap size={12} fill="currentColor" /> Ultra Edition 2026

          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-3 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tighter leading-tight">

            ULTRA DOWNLOADER

          </h1>

          <p className="text-gray-500 font-medium tracking-[0.1em] md:tracking-[0.2em] text-[10px] md:text-xs uppercase px-4">

            TẢI XUỐNG VIDEO ĐA NỀN TẢNG KHÔNG LOGO

          </p>

        </div>



        {/* Search Bar */}

        <div className="relative group max-w-2xl mx-auto mb-10 md:mb-16">

          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>

          <div className="relative flex flex-col sm:flex-row gap-2 bg-[#0f0f12] p-2 rounded-2xl border border-white/5 backdrop-blur-xl">

            <input

              className="flex-1 bg-transparent p-3 md:p-4 outline-none text-base md:text-lg placeholder:text-gray-600"

              placeholder="Dán link Video tại đây..."

              value={url} onChange={(e)=>setUrl(e.target.value)}

              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}

            />

            <button

              onClick={handleAnalyze}

              disabled={loading}

              className="bg-white text-black hover:bg-blue-500 hover:text-white px-6 md:px-8 py-3 sm:py-0 rounded-xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"

            >

              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}

              <span className="whitespace-nowrap">{loading ? "ĐANG QUÉT" : "PHÂN TÍCH"}</span>

            </button>

          </div>

        </div>



        {videoInfo && (

          <div className="bg-[#0f0f12] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl animate-in fade-in zoom-in duration-500 relative">

            <div className="flex flex-col md:flex-row">

              {/* Thumbnail Area */}

              <div className="w-full md:w-72 lg:w-80 relative group shrink-0 border-b md:border-b-0 md:border-r border-white/5 aspect-video md:aspect-auto">

                <img

                  src={videoInfo.thumbnail}

                  className="w-full h-full object-cover opacity-80"

                  alt="thumb"

                  referrerPolicy="no-referrer"

                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-transparent to-transparent md:hidden" />

              </div>



              {/* Download Content */}

              <div className="flex-1 p-5 md:p-8">

                <h2 className="font-bold text-lg md:text-xl line-clamp-2 mb-6 text-gray-100 leading-tight md:leading-snug">

                  {videoInfo.title}

                </h2>

               

                <div className="space-y-6">

                  {/* MP3 Section */}

                  <div>

                    <p className="text-[9px] md:text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">

                      <Music size={12} /> Nhạc nền (MP3)

                    </p>

                    <button

                      onClick={() => handleDownload(videoInfo.formats.find((f:any)=>f.id.includes('mp3'))?.downloadUrl || videoInfo.downloadUrl, `${videoInfo.title}.mp3`)}

                      disabled={downloading}

                      className="w-full flex justify-between items-center bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl md:rounded-2xl hover:bg-rose-500/20 transition-all group active:scale-[0.99]"

                    >

                      <span className="font-bold text-rose-500 uppercase text-[11px] md:text-xs">Tải Audio High Quality</span>

                      <Download size={18} className="text-rose-500 group-hover:translate-y-1 transition-transform" />

                    </button>

                  </div>



                  {/* MP4 Section */}

                  <div className="space-y-4">

                    <p className="text-[9px] md:text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">

                      <Video size={12} /> Tùy chọn Video

                    </p>

                   

                    {/* TIKTOK NO LOGO */}

                    {showTikTokOption && (

                      <button

                        onClick={() => handleDownload(videoInfo.downloadUrl, `${videoInfo.title}_no_logo.mp4`, true)}

                        disabled={downloading}

                        className="w-full flex justify-between items-center p-4 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 font-black text-white hover:brightness-110 transition-all shadow-xl shadow-blue-900/20 group active:scale-[0.98]"

                      >

                        <div className="flex items-center gap-3">

                           <CheckCircle size={20} className="text-cyan-200 shrink-0" />

                           <div className="text-left">

                              <p className="text-xs md:text-sm uppercase">Tải Không Logo (Bản Gốc)</p>

                              <p className="text-[8px] md:text-[9px] text-blue-100/70 font-medium">SERVER VIP - WATERMARK REMOVED</p>

                           </div>

                        </div>

                        <Zap size={18} className="group-hover:scale-125 transition-transform shrink-0" fill="currentColor" />

                      </button>

                    )}



                    {/* DANH SÁCH ĐỘ PHÂN GIẢI */}

                    <div className="grid grid-cols-1 gap-2 md:gap-3 max-h-[250px] md:max-h-[300px] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">

                      {videoInfo.formats?.map((f: any, i: number) => (

                        <button

                          key={f.id || i}

                          onClick={() => handleDownload(f.downloadUrl, `${videoInfo.title}_${f.quality}.mp4`)}

                          disabled={downloading}

                          className="flex justify-between items-center p-3 md:p-4 rounded-xl md:rounded-2xl transition-all border bg-white/[0.04] border-white/10 hover:bg-white/[0.08] group"

                        >

                          <div className="flex flex-col items-start text-left">

                             <span className="font-bold text-xs md:text-sm text-blue-400">{f.quality}</span>

                             <span className="text-[9px] md:text-[10px] text-gray-500 font-medium">MP4 • High Quality</span>

                          </div>

                          <Download size={18} className="text-blue-400 group-hover:translate-y-1 transition-all shrink-0" />

                        </button>

                      ))}

                    </div>

                  </div>

                </div>



                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/5 flex items-center justify-between">

                  <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-gray-600 font-bold uppercase tracking-tighter">

                    <ShieldCheck size={14} className="text-green-600 shrink-0" /> Link an toàn

                  </div>

                  <span className="text-[9px] md:text-[10px] text-gray-700 font-black italic">V2026.1</span>

                </div>

              </div>

            </div>



            {/* Progress Overlay */}

            {downloading && (

              <div className="absolute inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-300 p-6 text-center">

                <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />

                <h3 className="text-base md:text-lg font-black tracking-[0.1em] md:tracking-[0.2em] text-white uppercase italic">Đang tải file về máy</h3>

                <p className="text-gray-500 text-[9px] md:text-[10px] mt-2 font-medium uppercase leading-relaxed max-w-xs">

                  Vui lòng không đóng trình duyệt, tiến trình sẽ hoàn tất sau giây lát...

                </p>

              </div>

            )}

          </div>

        )}



        <div className="mt-10 md:mt-12 flex flex-col items-center gap-2 opacity-30">

            <Zap size={20} className="text-gray-500" />

            <p className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-center">

              Powered by Gemini & YT-DLP

            </p>

        </div>

      </div>



      <style jsx global>{`

        .custom-scrollbar::-webkit-scrollbar { width: 3px; }

        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }

        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }

      `}</style>

    </main>

  );

}