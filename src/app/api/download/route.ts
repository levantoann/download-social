import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(req: Request) {
  try {
    const { url, formatId, type, isNoLogo } = await req.json();
    
    if (!url) {
      return NextResponse.json({ success: false, error: "Thiếu URL video" }, { status: 400 });
    }

    const rootPath = process.cwd();
    const ytDlpPath = path.join(rootPath, 'yt-dlp.exe');
    // Đường dẫn FFmpeg của bạn
    const ffmpegDir = path.normalize("D:/ffmpeg/ffmpeg-2026-01-26-git-fe0813d6e2-essentials_build/ffmpeg-2026-01-26-git-fe0813d6e2-essentials_build/bin");
    
    const outputFolder = path.join(rootPath, 'public', 'downloads');
    if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

    // Tạo tên file duy nhất
    const filename = `ultra_${Date.now()}.${type === 'mp3' ? 'mp3' : 'mp4'}`;
    const outputPath = path.join(outputFolder, filename);

    let command = "";

    // 1. XỬ LÝ TẢI NHẠC (MP3)
    if (type === 'mp3') {
      command = `"${ytDlpPath}" --ffmpeg-location "${ffmpegDir}" -x --audio-format mp3 --audio-quality 0 "${url}" -o "${outputPath}"`;
    } 
    // 2. XỬ LÝ TIKTOK KHÔNG LOGO (Sử dụng API Mobile)
else if (url.includes('tiktok.com') && isNoLogo) {
  command = `"${ytDlpPath}" --ffmpeg-location "${ffmpegDir}" ` +
            `--no-playlist ` +
            // Chống chặn 1: Dùng User-Agent của Chrome thật trên Windows
            `--user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" ` +
            // Chống chặn 2: Thêm các header giả lập trình duyệt
            `--add-header "Accept-Language: vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7" ` +
            `--add-header "Referer: https://www.tiktok.com/" ` +
            `--no-check-certificate ` +
            // Quan trọng: Sử dụng API hostname mới nhất và thông tin app
            `--extractor-args "tiktok:api_hostname=api16-normal-c-useast1a.tiktokv.com;app_name=musical_ly;aid=1233" ` +
            // Lấy link video trực tiếp (thường là link không logo)
            `-f "bestvideo+bestaudio/best" ` +
            `--merge-output-format mp4 "${url}" -o "${outputPath}"`;
}
    // 3. XỬ LÝ YOUTUBE (Và các trang khác) 1080p+ CÓ TIẾNG
    else {
      // Logic quan trọng: Luôn lấy Video đã chọn ghép với Audio tốt nhất
      // Nếu không có formatId, tự lấy bản cao nhất hiện có
      const fId = formatId ? `${formatId}+bestaudio/best` : "bestvideo+bestaudio/best";
      
      command = `"${ytDlpPath}" --ffmpeg-location "${ffmpegDir}" ` +
                `-f "${fId}" ` +
                `--merge-output-format mp4 ` +
                `--postprocessor-args "ffmpeg:-c:v libx264 -pix_fmt yuv420p" ` + // Đảm bảo tương thích mọi đầu đọc
                `"${url}" -o "${outputPath}"`;
    }

    console.log("🚀 Đang thực thi lệnh:", command);

    // Chạy lệnh tải với bộ đệm đủ lớn
    await execPromise(command, { maxBuffer: 1024 * 1024 * 100 });

    return NextResponse.json({ 
      success: true, 
      downloadUrl: `/downloads/${filename}` 
    });

 } catch (error: any) {
    console.error("❌ LỖI CHI TIẾT:", error.stdout); // Xem nhật ký của yt-dlp trả về
    return NextResponse.json({ 
      success: false, 
      error: "TikTok đã chặn truy cập hoặc link video không tồn tại." 
    }, { status: 500 });
}
}