import { NextResponse } from 'next/server';
import { execa } from 'execa';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url'); 
  const fileName = searchParams.get('name') || 'video.mp4';

  if (!targetUrl) return new Response("Thiếu URL", { status: 400 });

  try {
    let finalDownloadUrl = targetUrl;

    // --- TRƯỜNG HỢP 1: LINK YOUTUBE (Cần yt-dlp giải mã) ---
    if (targetUrl.includes('youtube.com') || targetUrl.includes('youtu.be')) {
      const { stdout } = await execa('yt-dlp', [
        '--get-url',
        '-f', targetUrl.includes('.mp3') ? 'bestaudio' : 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        '--no-playlist',
        targetUrl
      ]);
      finalDownloadUrl = stdout.trim().split('\n')[0];
    }

    // --- TRƯỜNG HỢP 2: TẢI FILE THỰC TẾ (Sử dụng proxy) ---
    const response = await fetch(finalDownloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) throw new Error("Server gốc từ chối truy cập");

    return new NextResponse(response.body, {
      headers: {
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error: any) {
    console.error("Download Error:", error.message);
    return new Response(`Lỗi xử lý video: ${error.message}`, { status: 500 });
  }
}