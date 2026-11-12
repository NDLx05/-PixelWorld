# PixelWorld — lộ trình triển khai và tiêu chí hoàn thành

## Trạng thái triển khai hiện tại (alpha)

- **Nền tảng web:** GitHub Pages, PWA manifest, service worker và app-shell cache.
- **Lưu game:** IndexedDB ưu tiên, localStorage dự phòng, chuẩn hóa save v3 và chuyển đổi save cũ.
- **Thế giới:** tilemap riêng cho rừng và hang (40×30 ô, 24px/ô), collision layer, lối ra/vào mở đúng vị trí, camera cuộn, spawn tránh tường và lưu riêng trạng thái khu vực.
- **Nội dung dữ liệu:** vật phẩm, công thức, kỹ năng và nhiệm vụ được tách sang JSON; runtime đã đọc kỹ năng, công thức và quest data.
- **NPC/nhiệm vụ:** Trưởng lão Mira và một nhiệm vụ thu thập có trạng thái nhận/hoàn thành, phần thưởng XP và xu.
- **Chiến đấu:** ba lớp có nhánh kỹ năng khác nhau; projectile; hiệu ứng làm chậm/độc; phòng thủ, buff sát thương và boss Hộ vệ Pha Lê có phần thưởng riêng.
- **Âm thanh:** SFX tổng hợp bằng Web Audio API, có nút bật/tắt; chưa có nhạc nền và âm thanh thu âm.
- **Kiểm thử:** có 6 unit tests cho camera, va chạm, cooldown và migration save; GitHub Actions kiểm tra cú pháp module, JSON và chạy tests. Trạng thái Actions cần xác nhận sau khi workflow hoàn tất.

Đây vẫn là **alpha**, chưa phải game hoàn chỉnh. Đồ họa nhân vật và quái vẫn là hình khối tạm; không có sprite animation thực, tilemap hoàn chỉnh, thị trấn, boss, cửa hàng hay chuỗi nhiệm vụ.

## Các giai đoạn bắt buộc

1. **Nền tảng kỹ thuật**
   - [x] Tách hệ thống lưu, camera, va chạm và nội dung thành module.
   - [x] Save có phiên bản, IndexedDB, fallback và migration.
   - [ ] Tách toàn bộ game loop/UI/input thành module độc lập.
   - [ ] Hoàn thiện input đa điểm chạm, xử lý mất focus và safe-area trên iOS.

2. **Thế giới**
   - [x] Hai khu vực rừng/hang, camera và lưu trạng thái khu vực.
   - [x] Va chạm cơ bản với vật thể khai thác.
   - [x] Tilemap dữ liệu 40×30, collision layer, đường đi và lối vào/ra rừng–hang.\n   - [ ] Thêm điểm hồi sinh, vùng bản đồ mới và chi tiết địa hình phong phú.
   - [ ] Respawn tài nguyên/quái theo thời gian và thêm nhiều bản đồ.

3. **Nhân vật và đồ họa**
   - [ ] Tích hợp sprite sheet nhân vật đồng bộ, idle/walk/attack/hurt/death theo bốn hướng.
   - [ ] Animation công cụ, vũ khí, hiệu ứng va chạm và UI pixel hoàn chỉnh.
   - [ ] Trang bị, chỉ số phụ, ngoại hình và cây nâng cấp.

4. **Chiến đấu**
   - [x] Projectile và một số hiệu ứng trạng thái cơ bản.
   - [ ] Hitbox theo frame, hướng đánh, knockback, AI theo từng loại quái.
   - [x] Boss Hộ vệ Pha Lê đầu tiên, có máu lớn và phần thưởng riêng.\n   - [ ] Nhiều kiểu tấn công boss, loot table tổng quát, cân bằng và kiểm thử chiến đấu.

5. **Tiến trình**
   - [x] XP, lên cấp, ba lớp, kỹ năng, vật phẩm và chế tạo cơ bản.
   - [x] Một NPC và một nhiệm vụ mẫu.
   - [x] NPC thương nhân và cửa hàng mua thuốc/nâng cấp kiếm/rìu.\n   - [ ] Chuỗi nhiệm vụ, hội thoại nhiều nhánh, nhật ký nhiệm vụ và NPC chức năng khác.
   - [ ] Nhiều công thức, vật phẩm, trang bị và nâng cấp cân bằng.

6. **Âm thanh và nội dung**
   - [x] SFX tổng hợp và điều khiển âm thanh.
   - [ ] Nhạc nền theo vùng, ambience, âm thanh bước chân/công cụ/quái.
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
