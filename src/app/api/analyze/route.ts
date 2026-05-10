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

    // --- 2. XỬ LÝ YOUTUBE ---
    if (isYouTube) {
      const ytId = extractYoutubeId(url);
      
      // Kiểm tra nếu không lấy được ID thì báo lỗi ngay
      if (!ytId) {
        return NextResponse.json({ error: "Link YouTube không hợp lệ" }, { status: 400 });
      }

      return NextResponse.json({
        title: "YouTube Video Ready",
        // Sửa thumbnail sang hqdefault để video nào cũng hiện được ảnh
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

// Hàm lấy ID YouTube chính xác hơn
function extractYoutubeId(url: string) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[7] && match[7].length === 11) {
    return match[7];
  }
  return null; // Trả về null thay vì chuỗi rỗng để dễ kiểm tra lỗi
}