import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');
  const fileName = searchParams.get('name') || 'tiktok_video';

  if (!targetUrl) {
    return new Response("Thiếu URL để tải xuống", { status: 400 });
  }

  try {
    // 1. Fetch dữ liệu từ link TikTok trực tiếp (TikWM/CDN)
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Server TikTok phản hồi lỗi: ${response.status}`);
    }

    // 2. Xác định đuôi file dựa trên tên hoặc nội dung
    const isMp3 = targetUrl.includes('music') || fileName.toLowerCase().endsWith('.mp3');
    const extension = isMp3 ? '.mp3' : '.mp4';
    
    // Loại bỏ đuôi cũ nếu có và thêm đuôi chuẩn
    const cleanFileName = fileName.replace(/\.[^/.]+$/, "");
    const safeFileName = encodeURIComponent(cleanFileName + extension);

    // 3. Trả về Response dưới dạng Stream để trình duyệt tải xuống ngay lập tức
    return new NextResponse(response.body, {
      headers: {
        'Content-Disposition': `attachment; filename="${safeFileName}"; filename*=UTF-8''${safeFileName}`,
        'Content-Type': response.headers.get('Content-Type') || (isMp3 ? 'audio/mpeg' : 'video/mp4'),
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error: any) {
    console.error("❌ Lỗi tải TikTok:", error.message);
    
    // Nếu lỗi (ví dụ link hết hạn), nhảy thẳng đến link gốc như một phương án dự phòng
    return NextResponse.redirect(targetUrl.split('#')[0]);
  }
}