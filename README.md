# PixelWorld

Game phiêu lưu pixel 2D góc nhìn từ trên xuống, thiết kế màn hình ngang và ưu tiên Safari trên iPhone.

## Bản hiện tại

Đây vẫn là **prototype/alpha**, không phải bản phát hành hoàn chỉnh. Những phần đang có trong mã:
- Bản đồ rừng và hang động với camera cuộn.
- Ba lớp nhân vật và bốn nút kỹ năng.
- Điều khiển bàn phím và nút cảm ứng.
- Thu thập tài nguyên, chiến đấu, XP, lên cấp.
- Túi đồ, công thức chế tạo cơ bản và dùng thuốc hồi phục (nút P trên bàn phím / nút cảm ứng).
- Lưu tiến trình cục bộ bằng localStorage.
- Danh mục dữ liệu vật phẩm, công thức, kỹ năng và nhiệm vụ trong `data/`.
- NPC Trưởng lão Mira và nhiệm vụ thu thập đầu tiên, có lưu trạng thái hoàn thành.
- Lưu IndexedDB ưu tiên, tự chuyển về localStorage khi trình duyệt không hỗ trợ; tự nâng cấp save cũ.
- Va chạm di chuyển cơ bản với vật thể thu thập và camera cuộn có giới hạn bản đồ.
- Kiểm thử tự động Node.js trong `tests/` và GitHub Actions.
- PWA app shell: manifest và service worker để lưu vỏ ứng dụng sau lần tải đầu.

## Chơi trên iPhone

1. Mở trang GitHub Pages bằng Safari.
2. Xoay iPhone nằm ngang.
3. Tải trang khi đang có kết nối mạng để service worker lưu app shell.
4. Có thể chọn Chia sẻ → Thêm vào màn hình chính để mở như ứng dụng web.

## Giới hạn hiện tại

- Đồ họa nhân vật/quái vật còn là hình vẽ tạm, chưa tích hợp sprite animation hoàn chỉnh.
- Chưa có hệ thống nhiệm vụ/NPC/cửa hàng/boss hoàn chỉnh.
- Cân bằng chiến đấu, lưu trạng thái khu vực và kiểm thử Safari thực tế vẫn cần làm.
- Offline hiện chỉ nhắm đến app shell; chưa cam kết toàn bộ nội dung game hoạt động offline cho đến khi kiểm thử.

## Hướng phát triển

Tiếp tục tích hợp tài nguyên pixel đã bàn giao, chuẩn hóa hệ thống nhân vật/hoạt ảnh, chiến đấu, bản đồ, nhiệm vụ, vật phẩm, âm thanh, save/load và kiểm thử trên iPhone. Không đưa nguyên bộ dataset lớn vào bản chạy.
