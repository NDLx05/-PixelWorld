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
- Kiểm tra logic hệ thống: camera, biên thế giới, va chạm vật thể/tile, lối đi, migration save, cooldown, phục hồi bản lưu lỗi, giới hạn tiến trình và state machine AI quái đều đạt.
- Bổ sung kiểm tra tự động cho cấu trúc ba tilemap, spawn/exits, kết nối làng–rừng–hang, mọi đường dẫn app-shell trong service worker và các import module của trang game.
- Bổ sung lối thoát tường minh từ Rừng Khởi Nguyên về Làng An Yên trong dữ liệu bản đồ.
- Chuyển logic đổi khu vực sang đọc đúng ô exit trong tilemap; không còn đổi vùng chỉ vì đứng gần rìa bản đồ.
- Lưu lại trạng thái quái vật ngay cả khi khu vực không còn node tài nguyên.

## Kiểm tra bổ sung sau cập nhật
- Đã chạy kiểm tra trực tiếp các hàm xác thực tilemap trên cả ba bản đồ: đều hợp lệ.
- Đã kiểm tra bốn chiều kết nối làng–rừng–hang và kiểm tra cửa ra chỉ kích hoạt đúng ô: đều đạt.
- Đã sửa thời điểm mở khóa AudioContext trên thao tác bắt đầu/tiếp tục game để tương thích chính sách autoplay của trình duyệt.
- Đã gia cố `normalizeSave`: chuẩn hóa lớp nhân vật, tọa độ, HP/MP, cấp độ, tài nguyên, nhiệm vụ, timestamp và lọc entity/world-state lỗi.
- Đã tách AI quái sang `src/enemy-ai.js` với trạng thái idle/chase/attack/retreat/dead; quái yếu có thể lùi lại khi máu thấp, boss chuyển pha hai dưới 50% HP và tăng nhịp/tốc độ đạn.
- GitHub Actions `Tests` cho commit `653bd6a` hoàn tất với kết quả `success`: kiểm tra cú pháp browser module, source/test modules, JSON và `npm test` (26 tests, 26 passed).
- GitHub Actions `Deploy PixelWorld to GitHub Pages` cho commit `653bd6a` hoàn tất với kết quả `success`.

- Tách logic chọn mục tiêu cận chiến và tạo đạn thành `src/combat.js`; game runtime dùng chung hai helper thay cho đoạn xử lý lặp trong `index.html`.
- Bổ sung bốn unit tests cho vùng đánh phía trước, khoảng cách, hướng đạn và thuộc tính projectile.
- Thêm `src/combat.js` vào app-shell cache, nâng phiên bản lên `pixelworld-shell-v42`.
- GitHub Actions `Tests` cho commit `a90280c` hoàn tất `success`: 30 tests, 30 passed.
- Cập nhật dữ liệu AI theo từng loại: slime phát hiện gần và rút lui khi yếu; dơi nhanh, phát hiện xa và ít rút lui; boss có tầm phát hiện rộng hơn và không rút lui.
- Bổ sung ba unit tests kiểm tra sự khác biệt hành vi dựa trên `data/enemies.json`.
- GitHub Actions `Tests` cho commit `b295579` hoàn tất `success`: 33 tests, 33 passed.
- GitHub Actions `Deploy PixelWorld to GitHub Pages` cho commit `b295579` hoàn tất `success`.
- GitHub Actions `Deploy PixelWorld to GitHub Pages` cho commit `a90280c` hoàn tất `success`.

## Chưa được xác nhận
- Chưa xác nhận trực tiếp nội dung đã tải trên iPhone Safari sau lần triển khai mới nhất.
- Chưa chạy trực tiếp trên iPhone Safari iOS 17.6.1; cảm ứng nhiều ngón, orientation, PWA install và offline thực tế còn cần thiết bị thật.
- Chưa có kiểm thử hiệu năng dài, cân bằng game hoặc kiểm thử end-to-end.

- Tách quy tắc lên cấp và tính sát thương nhận vào thành `src/progression.js`; hai vị trí nhận sát thương (va chạm và đạn boss) dùng chung một công thức, cấp độ được kiểm soát bằng helper có giới hạn.
- Bổ sung bốn unit tests cho ngưỡng lên cấp, giới hạn cấp, giáp/giảm sát thương và dữ liệu sát thương không hợp lệ.
- Thêm `src/progression.js` vào app-shell cache và tăng cache lên `pixelworld-shell-v41` để module vẫn tải được khi offline.
- GitHub Actions `Tests` cho commit `2d25e88` hoàn tất `success`: 26 tests, 26 passed.
- GitHub Actions `Deploy PixelWorld to GitHub Pages` cho commit `2d25e88` hoàn tất `success`.

## Kết luận
Đây vẫn là alpha. CI và triển khai Pages đã thành công cho commit `b295579`. Chưa đủ điều kiện công bố bản phát hành hoàn chỉnh vì còn thiếu kiểm thử thiết bị thật, gameplay end-to-end và cân bằng nội dung.
