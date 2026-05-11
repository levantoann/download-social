import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Vui lòng nhập URL!" }, { status: 400 });

    const cleanUrl = url.trim();
    
    // Kiểm tra nếu không phải link TikTok thì báo lỗi luôn
    if (!cleanUrl.includes('tiktok.com')) {
      return NextResponse.json({ error: "Hiện tại hệ thống chỉ hỗ trợ TikTok!" }, { status: 400 });
    }

    // --- XỬ LÝ TIKTOK QUA API TIKWM ---
    const response = await fetch(`https://www.tikwm.com/api/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url: cleanUrl, hd: "1" }),
    });
    
    const resData = await response.json();

    if (!resData.data) {
      return NextResponse.json({ error: "Không tìm thấy video hoặc link sai!" }, { status: 404 });
    }

    const videoData = resData.data;

    return NextResponse.json({
      title: videoData.title || "TikTok Video",
      thumbnail: videoData.cover || "",
      isTikTok: true,
      // Trả về link trực tiếp để API Download chỉ việc fetch là xong, không cần yt-dlp
      downloadUrl: videoData.play, // Link video no logo chính
      formats: [
        {
          id: 'tk-video-hd',
          quality: 'Video No Logo (HD)',
          downloadUrl: videoData.hdplay || videoData.play
        },
        {
          id: 'tk-video-watermark',
          quality: 'Video có Logo',
          downloadUrl: videoData.wmplay
        },
        {
          id: 'tk-audio',
          quality: 'Nhạc nền (MP3)',
          downloadUrl: videoData.music
        }
      ]
    });

  } catch (err: any) {
    console.error("Analyze Error:", err.message);
    return NextResponse.json({ error: "Lỗi kết nối server" }, { status: 500 });
  }
}