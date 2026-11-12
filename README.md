# PixelWorld

Game phiêu lưu pixel 2D góc nhìn từ trên xuống, thiết kế màn hình ngang và ưu tiên Safari trên iPhone.

## Bản hiện tại

Đây vẫn là **prototype/alpha**, không phải bản phát hành hoàn chỉnh. Những phần đang có trong mã:
- Bản đồ tile riêng cho rừng và hang, camera cuộn, lối đi và va chạm theo tile.
- Ba lớp nhân vật, sprite sheet 4 hướng/4 frame bước đi và bốn kỹ năng riêng theo lớp.
- Điều khiển bàn phím và nút cảm ứng; có menu tạm dừng, tiếp tục và lưu về menu.
- Thu thập tài nguyên, chiến đấu, XP, lên cấp.
- Túi đồ, chế tạo, thuốc hồi phục; kiếm tăng sát thương, rìu tăng tốc khai thác, áo giáp giảm sát thương.
- Lưu tiến trình bằng IndexedDB ưu tiên, localStorage dự phòng; lưu trạng thái từng khu vực.
- Danh mục dữ liệu vật phẩm, công thức, kỹ năng và nhiệm vụ trong `data/`.
- NPC Trưởng lão Mira và nhiệm vụ thu thập đầu tiên, có lưu trạng thái hoàn thành.
- Boss Hộ vệ Pha Lê trong hang, có phần thưởng riêng; sprite pixel riêng cho slime, dơi, boss và NPC.
- Thương nhân Tâm bán thuốc hồi phục và nâng cấp kiếm, rìu, áo giáp bằng xu.
- Va chạm với tường tile và vật thể thu thập; quái vật cũng bị giới hạn bởi tường.
- Kỹ năng riêng theo lớp có projectile, làm chậm, độc, phòng thủ và buff sát thương cơ bản.
- SFX và âm nền riêng cho rừng/hang bằng Web Audio API, có nút bật/tắt.
- Kiểm thử tự động Node.js trong `tests/` và GitHub Actions.
- PWA app shell: manifest và service worker để lưu vỏ ứng dụng sau lần tải đầu.

## Chơi trên iPhone

1. Mở trang GitHub Pages bằng Safari.
2. Xoay iPhone nằm ngang.
3. Tải trang khi đang có kết nối mạng để service worker lưu app shell.
4. Có thể chọn Chia sẻ → Thêm vào màn hình chính để mở như ứng dụng web.

## Giới hạn hiện tại

- Nhân vật đã có hoạt ảnh bước đi; hoạt ảnh đánh, bị thương, chết và hoạt ảnh quái/NPC vẫn chưa hoàn thiện. Tilemap còn ở mức đầu tiên.
- Hiện mới có một nhiệm vụ mẫu, một cửa hàng và một boss; chưa có chuỗi nhiệm vụ hoặc nội dung phong phú.
- Cân bằng chiến đấu, hoạt ảnh sprite, mở rộng tilemap và kiểm thử Safari thực tế vẫn cần làm.
- Service worker cache app shell, module và dữ liệu game; cần kiểm thử offline thực tế trên Safari trước khi cam kết hoàn toàn.

## Hướng phát triển

Tiếp tục tích hợp tài nguyên pixel đã bàn giao, chuẩn hóa hệ thống nhân vật/hoạt ảnh, chiến đấu, bản đồ, nhiệm vụ, vật phẩm, âm thanh, save/load và kiểm thử trên iPhone. Không đưa nguyên bộ dataset lớn vào bản chạy.
