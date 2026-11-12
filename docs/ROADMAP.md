# PixelWorld — lộ trình triển khai và tiêu chí hoàn thành

## Trạng thái triển khai hiện tại (alpha)

- **Nền tảng web:** GitHub Pages, PWA manifest, service worker và app-shell cache.
- **Lưu game:** IndexedDB ưu tiên, localStorage dự phòng, chuẩn hóa save v4, chuyển đổi save cũ; có pause, lưu và quay về menu.
- **Thế giới:** tilemap riêng cho rừng và hang (40×30 ô, 24px/ô), collision layer, lối ra/vào, camera cuộn, spawn tránh tường, respawn tài nguyên/quái và lưu riêng trạng thái khu vực.
- **Nội dung dữ liệu:** vật phẩm, công thức, kỹ năng, nhiệm vụ, NPC, cửa hàng, quái và boss được tách sang JSON; runtime đọc dữ liệu tương ứng.
- **NPC/nhiệm vụ/cửa hàng:** Trưởng lão Mira giao nhiệm vụ thu thập; Nhà thám hiểm Khoa giao nhiệm vụ tiếp theo yêu cầu hạ boss; Thương nhân Tâm bán vật phẩm và nâng cấp.
- **Chiến đấu:** Kiếm Vệ đánh cận chiến theo hướng nhìn; Linh Pháp và Du Hiệp bắn projectile; kỹ năng riêng, hiệu ứng làm chậm/độc, phòng thủ, buff và boss bắn tinh thể.
- **Đồ họa:** sprite sheet nhân vật ba lớp, bốn hướng, bốn frame đi bộ/tấn công/bị thương/gục ngã; có sprite riêng cho slime, dơi hang, boss và hai NPC.
- **Âm thanh:** SFX tổng hợp và ambient drone theo vùng rừng/hang bằng Web Audio API; có nút bật/tắt. Chưa có bản nhạc nhiều giai điệu và âm thanh thu âm.
- **Kiểm thử:** có 7 unit tests cho camera, va chạm, cooldown và migration save; GitHub Actions kiểm tra cú pháp module, JSON và chạy tests. Trạng thái Actions cần xác nhận sau khi workflow hoàn tất.

Đây vẫn là **alpha**, chưa phải game hoàn chỉnh. Đồ họa nhân vật và quái vẫn là hình khối tạm; tilemap mới là bản đầu tiên; mới có một boss, một nhiệm vụ và một cửa hàng mẫu, chưa có nội dung đủ chiều sâu để phát hành.

## Các giai đoạn bắt buộc

1. **Nền tảng kỹ thuật**
   - [x] Tách hệ thống lưu, camera, va chạm và nội dung thành module.
   - [x] Save có phiên bản, IndexedDB, fallback và migration.
   - [ ] Tách toàn bộ game loop/UI/input thành module độc lập.
   - [x] Pause/resume và lưu hành trình trước khi về menu.
   - [x] D-pad dùng pointer events đa điểm chạm và tự xóa phím giữ khi mất focus.\n   - [ ] Kiểm thử cảm ứng nhiều ngón, safe-area và orientation trên iOS thật.

2. **Thế giới**
   - [x] Hai khu vực rừng/hang, camera và lưu trạng thái khu vực.
   - [x] Va chạm cơ bản với vật thể khai thác.
   - [x] Tilemap dữ liệu 40×30, collision layer, đường đi và lối vào/ra rừng–hang.
   - [ ] Thêm điểm hồi sinh, vùng bản đồ mới và chi tiết địa hình phong phú.
   - [x] Respawn tài nguyên và quái theo thời gian.
   - [ ] Thêm nhiều bản đồ và điểm hồi sinh.

3. **Nhân vật và đồ họa**
   - [x] Sprite sheet nhân vật ba lớp, bốn hướng, bốn frame bước đi và bốn frame tấn công.
   - [x] Sprite tĩnh cho slime, dơi hang, boss và NPC.
   - [x] Bổ sung hoạt ảnh bị thương và gục ngã.
   - [ ] Hoạt ảnh công cụ, hiệu ứng va chạm và nhiều biến thể nhân vật.
   - [ ] Animation công cụ, vũ khí, hiệu ứng va chạm và UI pixel hoàn chỉnh.
   - [ ] Trang bị, chỉ số phụ, ngoại hình và cây nâng cấp.

4. **Chiến đấu**
   - [x] Projectile và một số hiệu ứng trạng thái cơ bản.
   - [ ] Hitbox theo frame, hướng đánh, knockback, AI chiến thuật riêng theo từng loại quái.
   - [x] Boss Hộ vệ Pha Lê có máu lớn, đòn bắn tinh thể và phần thưởng riêng.
   - [ ] Nhiều kiểu tấn công boss, loot table tổng quát, cân bằng và kiểm thử chiến đấu.

5. **Tiến trình**
   - [x] XP, lên cấp, ba lớp, kỹ năng, vật phẩm và chế tạo cơ bản.
   - [x] Hai nhiệm vụ nối tiếp: thu thập tiếp tế, hạ boss và mang pha lê về.
   - [x] NPC Trưởng lão, nhà thám hiểm và thương nhân.
   - [x] NPC thương nhân và cửa hàng mua thuốc/nâng cấp kiếm/rìu.
   - [ ] Chuỗi nhiệm vụ, hội thoại nhiều nhánh, nhật ký nhiệm vụ và NPC chức năng khác.
   - [x] Trang bị kiếm/rìu/áo giáp có tác dụng trong chiến đấu và khai thác.
   - [ ] Mở rộng công thức, vật phẩm, trang bị và cây nâng cấp cân bằng.

6. **Âm thanh và nội dung**
   - [x] SFX tổng hợp và điều khiển âm thanh.
   - [x] Ambient nền khác nhau giữa rừng và hang, có điều khiển bật/tắt.
   - [ ] Nhạc nền có giai điệu, ambience tự nhiên và âm thanh bước chân/công cụ/quái.
   - [ ] Làng, khu vực mới, boss, sự kiện và nội dung cuối game.

7. **Chất lượng và phát hành**
   - [x] Unit tests cơ bản và workflow CI.
   - [ ] Kiểm thử end-to-end trên trình duyệt desktop và iPhone Safari iOS 17.6.1.
   - [ ] Kiểm thử cài PWA, xoay ngang, cảm ứng nhiều ngón, mất mạng, reload và khôi phục save.
   - [ ] Kiểm tra hiệu năng, pin, bộ nhớ, khả năng tương thích và cân bằng.
   - [ ] Chỉ phát hành khi mọi hạng mục bắt buộc được xác minh.

## Nguyên tắc dự án

- Web-first, offline-first, chơi đơn, 2D pixel góc nhìn từ trên xuống, màn hình ngang 16:9.
- Ưu tiên Safari trên iPhone; phát triển và kiểm thử mã nguồn trên Windows.
- Không sửa dự án HTBB và không trộn tài nguyên từ các dự án khác.
- Chỉ tích hợp tài nguyên có thể xác minh nguồn và giấy phép; sprite tĩnh không được coi là animation.
- Không tuyên bố hoàn thành khi chưa kiểm thử trên thiết bị thật.

## Phụ thuộc cần thiết

Gói tài nguyên pixel đã bàn giao trước đây hiện không nằm trong workspace của phiên làm việc này. Khi đến giai đoạn tích hợp sprite/tile/audio gốc, cần có lại đúng gói tài nguyên tương ứng; không tải lại hoặc thay thế bằng tài nguyên khác khi chưa được yêu cầu.
