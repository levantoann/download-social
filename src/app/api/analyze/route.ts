import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL không được để trống" }, { status: 400 });

    const rootPath = process.cwd();
    const ytDlpPath = path.join(rootPath, 'yt-dlp.exe');
    // Đường dẫn tới thư mục bin của ffmpeg
    const ffmpegPath = "D:/ffmpeg/ffmpeg-2026-01-26-git-fe0813d6e2-essentials_build/ffmpeg-2026-01-26-git-fe0813d6e2-essentials_build/bin";

    // Lấy metadata JSON
    const command = `"${ytDlpPath}" --ffmpeg-location "${ffmpegPath}" -j "${url}"`;
    const stdout = execSync(command, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 50 });
    const info = JSON.parse(stdout);

    const isTikTok = url.includes('tiktok.com');

    // 1. Lọc lấy các định dạng video
    let allFormats = (info.formats || [])
      .filter((f: any) => f.vcodec !== 'none') // Lấy tất cả có hình (để sau này ghép tiếng sau)
      .map((f: any) => {
        let label = `${f.height}p`;
        if (f.height >= 2160) label = `4K Ultra HD (${f.height}p)`;
        else if (f.height >= 1440) label = `2K Quad HD (${f.height}p)`;
        else if (f.height >= 1080) label = `Full HD 1080p`;
        else if (f.height >= 720) label = `HD 720p`;

        return {
          id: f.format_id,
          quality: label,
          height: f.height || 0,
          filesize: f.filesize ? (f.filesize / (1024 * 1024)).toFixed(1) + ' MB' : 'Dung lượng cao',
          isNoLogo: false // Mặc định là bản thường
        };
      })
      .filter((f: any) => f.height > 0)
      // Loại bỏ trùng lặp độ phân giải
      .reduce((acc: any[], current: any) => {
        const x = acc.find(item => item.height === current.height);
        if (!x) return acc.concat([current]);
        return acc;
      }, [])
      .sort((a: any, b: any) => b.height - a.height);

    // 2. NẾU LÀ TIKTOK: Chèn thêm một tùy chọn "Không Logo" lên đầu danh sách
    if (isTikTok) {
      const noLogoOption = {
        id: 'best', // yt-dlp sẽ tự chọn bản tốt nhất khi tải
        quality: 'Tải không Logo (Gốc)',
        height: 10000, // Để nó nhảy lên đầu khi sort
        filesize: 'N/A',
        isNoLogo: true
      };
      allFormats = [noLogoOption, ...allFormats];
    }

    return NextResponse.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration_string,
      formats: allFormats,
      isTikTok: isTikTok,
      originalUrl: url
    });

  } catch (error: any) {
    console.error("❌ LỖI CHI TIẾT:", error.stdout); // Xem nhật ký của yt-dlp trả về
    return NextResponse.json({ 
      success: false, 
      error: "TikTok đã chặn truy cập hoặc link video không tồn tại." 
    }, { status: 500 });
}
}