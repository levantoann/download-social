import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Vui lòng nhập URL!" }, { status: 400 });

    const cleanUrl = url.trim();
    const isTikTok = cleanUrl.includes('tiktok.com');
    const isYouTube = cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be');

    // --- 1. XỬ LÝ TIKTOK ---
    if (isTikTok) {
      const response = await fetch(`https://www.tikwm.com/api/`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ url: cleanUrl, hd: "1" }),
      });
      const resData = await response.json();

      return NextResponse.json({
        title: resData.data?.title || "TikTok Video",
        thumbnail: resData.data?.cover || "",
        isTikTok: true,
        formats: [
          {
            id: 'tk-video',
            quality: 'Video No Logo (Server VIP)',
            // Gửi link gốc kèm flag để Backend Download biết cần dùng yt-dlp
            downloadUrl: cleanUrl + "#video" 
          },
          {
            id: 'tk-audio',
            quality: 'Nhạc nền (MP3)',
            downloadUrl: cleanUrl + "#mp3" 
          }
        ]
      });
    }

    // --- 2. XỬ LÝ YOUTUBE (GIỮ NGUYÊN 100%) ---
    if (isYouTube) {
      const ytId = extractYoutubeId(cleanUrl);
      if (!ytId) return NextResponse.json({ error: "Link không hợp lệ" }, { status: 400 });

      return NextResponse.json({
        title: "YouTube Video Ready",
        thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
        isTikTok: false,
        formats: [
          {
            id: 'yt-1080',
            quality: 'Video Full HD (1080p)',
            downloadUrl: `https://api.vevioz.com/api/button/videos/${ytId}`
          },
          {
            id: 'yt-720',
            quality: 'Video HD (720p)',
            downloadUrl: `https://api.vevioz.com/api/button/videos/${ytId}`
          },
          {
            id: 'yt-mp3', 
            quality: 'Tải Nhạc MP3',
            downloadUrl: `https://api.vevioz.com/api/button/mp3/${ytId}`
          }
        ]
      });
    }

    return NextResponse.json({ error: "Nền tảng chưa hỗ trợ!" }, { status: 400 });
  } catch (err: any) {
    console.error("Analyze Error:", err.message);
    return NextResponse.json({ error: "Lỗi kết nối server" }, { status: 500 });
  }
}

function extractYoutubeId(url: string) {
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[1]?.length === 11) ? match[1] : null;
}