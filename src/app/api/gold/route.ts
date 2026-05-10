import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    const response = await fetch("https://webgia.com/gia-vang/", {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) throw new Error("Kết nối trang nguồn thất bại");

    // Ép kiểu UTF-8 chuẩn xác
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('utf-8'); 
    const html = decoder.decode(buffer);

    /**
     * SỬA LỖI decodeEntities:
     * Trong phiên bản mới, bạn không cần truyền options này nữa. 
     * Cheerio mặc định xử lý text khá tốt nếu HTML đầu vào đã là UTF-8.
     */
    const $ = cheerio.load(html); 

    const goldPrices: any[] = [];
    const today = new Date().toLocaleDateString("vi-VN");

    $("table.table").each((_, table) => {
      $(table).find("tbody tr").each((_, row) => {
        const cells = $(row).find("td");
        
        if (cells.length >= 3) {
          // Sử dụng .text() sẽ tự động lấy nội dung đã giải mã
          const fullName = $(cells[0]).text().trim();
          const buy = $(cells[1]).text().trim();
          const sell = $(cells[2]).text().trim();

          const brands = [
            "SJC", "DOJI", "PNJ", "PHÚ QUÝ", "BẢO TÍN MINH CHÂU", 
            "MI HỒNG", "VIETINBANK GOLD", "BẢO TÍN LAN VỸ", "NGỌC THẨM"
          ];

          const isTargetBrand = brands.some(brand => 
            fullName.toUpperCase().includes(brand)
          );

          if (isTargetBrand && buy !== "-" && buy !== "" && !isNaN(parseFloat(buy.replace(/,/g, '')))) {
            const companyName = brands.find(b => fullName.toUpperCase().includes(b)) || "Vàng";
            
            goldPrices.push({
              company: companyName.toUpperCase(),
              type: fullName, // Giữ nguyên tên gốc có dấu
              buy: buy,
              sell: sell,
              time: today
            });
          }
        }
      });
    });

    if (goldPrices.length === 0) throw new Error("No data found");

    return NextResponse.json({ data: goldPrices });

  } catch (error) {
    console.error("Crawl Error:", error);
    return NextResponse.json({ 
      error: "Cần cập nhật lại nguồn dữ liệu",
      data: [{ company: "SJC", type: "Vàng SJC", buy: "82.00", sell: "85.00", time: "Dự phòng" }]
    });
  }
}