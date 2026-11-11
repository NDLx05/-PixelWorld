# PixelWorld — lộ trình hoàn thiện

## Trạng thái hiện tại
Bản `main` là alpha chạy trên trình duyệt. Đã có màn hình chọn lớp, di chuyển, thu thập tài nguyên, quái cơ bản, túi đồ/chế tạo đơn giản, chuyển rừng–hang, lưu cục bộ và điều khiển cảm ứng. Hình nhân vật/quái hiện vẫn được vẽ bằng hình khối; chưa phải bản đồ tile/sprite animation hoàn chỉnh.

## Các giai đoạn bắt buộc trước khi gọi là hoàn chỉnh
1. **Nền tảng kỹ thuật:** tách mã thành module; hệ thống input đa điểm chạm; camera và va chạm; lưu IndexedDB có phiên bản, khôi phục an toàn và migration.
2. **Thế giới:** tilemap có collision, vùng chuyển tiếp, điểm hồi sinh, vật thể tương tác, trạng thái tài nguyên bền vững.
3. **Nhân vật:** sprite sheet nhất quán, idle/walk/attack/hurt/death theo 4 hướng, hoạt ảnh công cụ, chỉ số và trang bị.
4. **Chiến đấu:** hitbox/projectile, thời gian ra đòn, phòng thủ, hiệu ứng trạng thái, AI từng nhóm quái, loot và respawn.
5. **Tiến trình:** cấp độ, kỹ năng riêng từng lớp, cây nâng cấp, vật phẩm, chế tạo, nhiệm vụ và hội thoại NPC.
6. **Nội dung:** làng, rừng, hang, khu vực mới, boss, cửa hàng, âm thanh và nhạc nền.
7. **Chất lượng:** kiểm thử tự động, kiểm thử lưu/tải, hiệu năng mobile, safe-area, xoay ngang, Safari iOS 17.6.1 và chơi offline sau khi cache.

## Nguyên tắc
- Web-first, offline-first, chơi đơn, màn hình ngang 16:9; ưu tiên Safari trên iPhone.
- Không sửa dự án HTBB hoặc trộn tài nguyên từ dự án khác.
- Tài nguyên đã bàn giao phải được rà soát giấy phép và tính nhất quán trước khi tích hợp. Không coi sprite tĩnh là animation.
- Chỉ công bố hoàn thành sau khi các giai đoạn trên đã được triển khai và kiểm thử trên thiết bị thật.

## Data-driven content
Các tệp `data/*.json` là danh mục dữ liệu chuẩn ban đầu. Runtime sẽ được chuyển dần sang đọc các định nghĩa này thay vì hard-code trong `index.html`.
