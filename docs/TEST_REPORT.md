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
- Kiểm tra logic hệ thống: camera, biên thế giới, va chạm vật thể/tile, lối đi, migration save, cooldown và phục hồi bản lưu lỗi đều đạt.
- Bổ sung kiểm tra tự động cho cấu trúc ba tilemap, spawn/exits, kết nối làng–rừng–hang, mọi đường dẫn app-shell trong service worker và các import module của trang game.
- Bổ sung lối thoát tường minh từ Rừng Khởi Nguyên về Làng An Yên trong dữ liệu bản đồ.
- Chuyển logic đổi khu vực sang đọc đúng ô exit trong tilemap; không còn đổi vùng chỉ vì đứng gần rìa bản đồ.
- Lưu lại trạng thái quái vật ngay cả khi khu vực không còn node tài nguyên.

## Kiểm tra bổ sung sau cập nhật
- Đã chạy kiểm tra trực tiếp các hàm xác thực tilemap trên cả ba bản đồ: đều hợp lệ.
- Đã kiểm tra bốn chiều kết nối làng–rừng–hang và kiểm tra cửa ra chỉ kích hoạt đúng ô: đều đạt.
- Đã sửa thời điểm mở khóa AudioContext trên thao tác bắt đầu/tiếp tục game để tương thích chính sách autoplay của trình duyệt.
- Đã gia cố `normalizeSave`: chuẩn hóa lớp nhân vật, tọa độ, HP/MP, cấp độ, tài nguyên, nhiệm vụ, timestamp và lọc entity/world-state lỗi.
- GitHub Actions `Tests` cho commit `b73fb63` hoàn tất với kết quả `success`; workflow đã chạy kiểm tra cú pháp browser module, source/test modules, JSON và `npm test`.
- GitHub Actions `Deploy PixelWorld to GitHub Pages` cho cùng commit hoàn tất với kết quả `success`.

## Chưa được xác nhận
- Chưa xác nhận trực tiếp nội dung đã tải trên iPhone Safari sau lần triển khai mới nhất.
- Chưa chạy trực tiếp trên iPhone Safari iOS 17.6.1; cảm ứng nhiều ngón, orientation, PWA install và offline thực tế còn cần thiết bị thật.
- Chưa có kiểm thử hiệu năng dài, cân bằng game hoặc kiểm thử end-to-end.

## Kết luận
Đây vẫn là alpha. CI và triển khai Pages đã thành công cho commit `b73fb63`. Đây vẫn là alpha; chưa đủ điều kiện công bố bản phát hành hoàn chỉnh vì còn thiếu kiểm thử thiết bị thật, gameplay end-to-end và cân bằng nội dung.
