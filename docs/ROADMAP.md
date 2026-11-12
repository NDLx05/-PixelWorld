# PixelWorld — lộ trình triển khai và tiêu chí hoàn thành

## Trạng thái triển khai hiện tại (alpha)

- **Nền tảng web:** GitHub Pages, PWA manifest, icon ứng dụng SVG, service worker và app-shell cache.
- **Lưu game:** IndexedDB ưu tiên, localStorage dự phòng, chuẩn hóa save v4, chuyển đổi save cũ; có pause, lưu và quay về menu.
- **Thế giới:** ba khu vực Làng An Yên, Rừng Khởi Nguyên và Hang Pha Lê; tilemap 40×30, collision layer, cửa chuyển vùng lấy từ ô exit hợp lệ, camera cuộn, respawn tài nguyên/quái và lưu trạng thái từng khu vực.
- **Nội dung dữ liệu:** vật phẩm, công thức, kỹ năng, nhiệm vụ, NPC, cửa hàng, quái và boss được tách sang JSON; runtime kiểm tra kích thước tilemap, collision, spawn và lối ra trước khi dùng.
- **NPC/nhiệm vụ/cửa hàng:** Trưởng lão Mira giao nhiệm vụ thu thập; Nhà thám hiểm Khoa giao nhiệm vụ tiếp theo yêu cầu hạ boss; Thương nhân Tâm bán vật phẩm và nâng cấp.
- **Chiến đấu:** Kiếm Vệ đánh cận chiến theo hướng nhìn; Linh Pháp và Du Hiệp bắn projectile; đạn bị chặn bởi tường tile; AI quái có trạng thái idle/chase/attack/retreat/dead; boss có hai pha và đạn tinh thể tăng tốc ở pha hai.
- **Đồ họa:** sprite sheet nhân vật ba lớp, bốn hướng, bốn frame đi bộ/tấn công/bị thương/gục ngã; có sprite riêng cho slime, dơi hang, boss và hai NPC.
- **Âm thanh:** SFX tổng hợp và ambient drone theo vùng rừng/hang bằng Web Audio API; có nút bật/tắt. Chưa có bản nhạc nhiều giai điệu và âm thanh thu âm.
- **Kiểm thử:** 26 unit tests cho AI, save, bản đồ, camera, va chạm, cooldown, offline fallback và giới hạn tiến trình; GitHub Actions kiểm tra cú pháp module, JSON và chạy `npm test`. Commit `2d25e88` có CI và triển khai Pages thành công.

Đây vẫn là **alpha**, chưa phải game hoàn chỉnh. Đồ họa nhân vật và quái vẫn là hình khối tạm; tilemap mới là bản đầu tiên; mới có một boss, một nhiệm vụ và một cửa hàng mẫu, chưa có nội dung đủ chiều sâu để phát hành.

## Các giai đoạn bắt buộc

1. **Nền tảng kỹ thuật**
   - [x] Tách hệ thống lưu, camera, va chạm và nội dung thành module.
   - [x] Save có phiên bản, IndexedDB, fallback và migration.
   - [ ] Tách toàn bộ game loop/UI thành module độc lập.
   - [x] Tách quy tắc lên cấp và tính sát thương nhận vào thành module dùng chung, có unit tests.
   - [x] Giảm tải render tilemap bằng camera culling và giới hạn tần suất cập nhật HUD.
   - [x] Tách keyboard input manager thành module riêng.
   - [x] Pause/resume và lưu hành trình trước khi về menu.
   - [x] D-pad dùng pointer events đa điểm chạm và tự xóa phím giữ khi mất focus.
   - [ ] Kiểm thử cảm ứng nhiều ngón, safe-area và orientation trên iOS thật.

2. **Thế giới**
   - [x] Ba khu vực làng/rừng/hang, camera và lưu trạng thái khu vực.
   - [x] Va chạm cơ bản với vật thể khai thác.
   - [x] Tilemap dữ liệu 40×30, collision layer, đường đi và lối nối làng–rừng–hang.
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
   - [x] AI state machine dùng chung với idle/chase/attack/retreat/dead và kiểm thử chuyển trạng thái.
   - [ ] Hitbox theo frame, hướng đánh, knockback và AI chiến thuật riêng theo từng loại quái.
   - [x] Boss Hộ vệ Pha Lê có máu lớn, đòn bắn tinh thể, hai pha chiến đấu và phần thưởng riêng.
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
   - [x] Service worker chỉ dùng HTML app-shell fallback cho navigation; lỗi asset offline trả 503.
   - [ ] Kiểm thử cài PWA, xoay ngang, cảm ứng nhiều ngón, mất mạng, reload và khôi phục save.
   - [ ] Kiểm tra hiệu năng, pin, bộ nhớ, khả năng tương thích và cân bằng.
   - [ ] Chỉ phát hành khi mọi hạng mục bắt buộc được xác minh.

- [x] Bổ sung progression/combat helper; service worker cache cập nhật lên `pixelworld-shell-v41`.

## Nguyên tắc dự án

- Web-first, offline-first, chơi đơn, 2D pixel góc nhìn từ trên xuống, màn hình ngang 16:9.
- Ưu tiên Safari trên iPhone; phát triển và kiểm thử mã nguồn trên Windows.
- Không sửa dự án HTBB và không trộn tài nguyên từ các dự án khác.
- Chỉ tích hợp tài nguyên có thể xác minh nguồn và giấy phép; sprite tĩnh không được coi là animation.
- Không tuyên bố hoàn thành khi chưa kiểm thử trên thiết bị thật.

## Phụ thuộc cần thiết

Gói tài nguyên pixel đã bàn giao trước đây hiện không nằm trong workspace của phiên làm việc này. Khi đến giai đoạn tích hợp sprite/tile/audio gốc, cần có lại đúng gói tài nguyên tương ứng; không tải lại hoặc thay thế bằng tài nguyên khác khi chưa được yêu cầu.
