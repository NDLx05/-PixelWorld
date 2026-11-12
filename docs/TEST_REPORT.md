# PixelWorld — kiểm tra bản alpha

Ngày ghi nhận: 2026-11-12

## Đã kiểm tra trong phiên phát triển
- Cú pháp JavaScript của module trong `index.html`: hợp lệ khi parse.
- Cú pháp các module `src/systems.js`, `src/content.js`, `src/audio.js`: hợp lệ khi parse.
- SVG: icon PWA và sprite sheet nhân vật/quái/NPC có cấu trúc SVG hợp lệ.
- JSON: vật phẩm, công thức, kỹ năng, nhiệm vụ, quái/boss, cửa hàng, ba tilemap và manifest đều parse được.
- Tilemap: làng, rừng và hang đều có kích thước 40×30, collision grid khớp terrain, điểm spawn và lối đi ra/vào nằm trên ô đi được.
- Tham chiếu nội dung: NPC trỏ đến quest/shop tồn tại; boss definition và danh sách hàng có dữ liệu.
- DOM: tất cả ID được JavaScript truy vấn đều có phần tử tương ứng.
- Kiểm tra logic hệ thống: 7 nhóm kiểm tra camera, biên thế giới, va chạm vật thể, va chạm tile, lối đi, migration save v4 và cooldown đều đạt.
- Bổ sung kiểm tra tự động cho cấu trúc ba tilemap, spawn/exits, kết nối làng–rừng–hang, mọi đường dẫn app-shell trong service worker và các import module của trang game.
- Bổ sung lối thoát tường minh từ Rừng Khởi Nguyên về Làng An Yên trong dữ liệu bản đồ.
- Chuyển logic đổi khu vực sang đọc đúng ô exit trong tilemap; không còn đổi vùng chỉ vì đứng gần rìa bản đồ.
- Lưu lại trạng thái quái vật ngay cả khi khu vực không còn node tài nguyên.

## Chưa được xác nhận
- Kết quả GitHub Actions của commit mới nhất chưa đọc được từ connector trong phiên này; không ghi nhận workflow là xanh.
- GitHub Pages chưa được xác nhận đã triển khai commit mới nhất.
- Chưa chạy trực tiếp trên iPhone Safari iOS 17.6.1; cảm ứng nhiều ngón, orientation, PWA install và offline thực tế còn cần thiết bị thật.
- Chưa có kiểm thử hiệu năng dài, cân bằng game hoặc kiểm thử end-to-end.

## Kết luận
Đây vẫn là alpha. Các kiểm tra tĩnh và logic nền nêu trên đạt trong phiên, nhưng chưa đủ điều kiện công bố bản phát hành hoàn chỉnh.
