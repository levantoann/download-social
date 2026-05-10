import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Vui lòng nhập URL" }, { status: 400 });

    const isTikTok = url.includes('tiktok.com');
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

    // --- 1. XỬ LÝ TIKTOK ---
    if (isTikTok) {
      const response = await fetch(`https://www.tikwm.com/api/`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ url: url, hd: "1" }),
      });
      const resData = await response.json();
      if (resData.code === 0) {
        return NextResponse.json({
          title: resData.data.title || "TikTok Video",
          thumbnail: resData.data.cover.startsWith('http') ? resData.data.cover : `https://www.tikwm.com${resData.data.cover}`,
          isTikTok: true,
          formats: [{
            id: 'no-logo',
            quality: 'Tải không Logo',
            downloadUrl: resData.data.play.startsWith('http') ? resData.data.play : `https://www.tikwm.com${resData.data.play}`
          }]
        });
      }
    }

    // --- 2. XỬ LÝ YOUTUBE (Đã fix link ứng dụng youtu.be) ---
    if (isYouTube) {
      const ytId = extractYoutubeId(url);
      
      if (!ytId) {
        return NextResponse.json({ error: "Link YouTube không hợp lệ hoặc không tìm thấy ID" }, { status: 400 });
      }

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

    return NextResponse.json({ error: "Nền tảng này hiện chưa hỗ trợ" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: "Lỗi kết nối server" }, { status: 500 });
  }
}

// Hàm lấy ID YouTube tối ưu nhất
function extractYoutubeId(url: string) {
  // Regex này xử lý được: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, và các tham số ?si=, ?t=
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  // Trả về ID nếu tìm thấy và đúng 11 ký tự
  if (match && match[1] && match[1].length === 11) {
    return match[1];
  }
  return null;
}