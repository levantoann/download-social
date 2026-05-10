import { NextResponse } from 'next/server';
import { execa } from 'execa';
import path from 'path';
import fs from 'fs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');
  const fileName = searchParams.get('name') || 'video';

  if (!targetUrl) return new Response("Thiếu URL", { status: 400 });

  const [actualUrl, mode] = targetUrl.split('#');
  const isMp3 = mode === 'mp3' || fileName.toLowerCase().endsWith('.mp3');

  try {
    const rootPath = process.cwd();
    
    // --- KHU VỰC SỬA LỖI ĐƯỜNG DẪN ---
    let command = '';
    const localExe = path.join(rootPath, 'yt-dlp.exe');
    // Đường dẫn binary mà yt-dlp-exec tải về trên Vercel (Linux)
    const vercelBinary = path.join(rootPath, 'node_modules', 'yt-dlp-exec', 'bin', 'yt-dlp');

    if (fs.existsSync(localExe)) {
      command = localExe; // Local Windows
    } else if (fs.existsSync(vercelBinary)) {
      command = vercelBinary; // Vercel Linux
      // Cấp quyền thực thi cho file trên Linux (bắt buộc)
      fs.chmodSync(vercelBinary, '755');
    } else {
      command = 'yt-dlp'; // Dự phòng cuối cùng
    }
    // --------------------------------

    const args = [
      '--get-url',
      '--no-playlist',
      '--no-check-certificate',
      '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    ];

    if (isMp3) {
      args.push('-f', 'bestaudio');
    } else if (actualUrl.includes('tiktok.com')) {
      args.push('-f', 'bestvideo+bestaudio/best');
      args.push('--extractor-args', 'tiktok:api_hostname=api16-normal-c-useast1a.tiktokv.com;app_name=musical_ly;aid=1233');
    } else {
      args.push('-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best');
    }

    args.push(actualUrl);

    const { stdout } = await execa(command, args);
    const finalDownloadUrl = stdout.trim().split('\n')[0];

    const response = await fetch(finalDownloadUrl);
    if (!response.ok) throw new Error("Server gốc từ chối");

    const extension = isMp3 ? '.mp3' : '.mp4';
    const safeFileName = encodeURIComponent(fileName.replace(/\.[^/.]+$/, "") + extension);

    return new NextResponse(response.body, {
      headers: {
        'Content-Disposition': `attachment; filename="${safeFileName}"; filename*=UTF-8''${safeFileName}`,
        'Content-Type': response.headers.get('Content-Type') || (isMp3 ? 'audio/mpeg' : 'video/mp4'),
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error: any) {
    console.error("❌ Chi tiết lỗi:", error.message);
    // Nếu vẫn lỗi, hãy thử redirect
    return NextResponse.redirect(actualUrl.replace('#', ''));
  }
}