# Ứng dụng Đếm Bước Chân 🚶

Ứng dụng web đơn giản để theo dõi số bước chân khi đi bộ.

## Tính năng

- ✅ Đếm số bước chân tự động bằng cảm biến chuyển động
- ✅ Tính toán khoảng cách đã đi (km)
- ✅ Tính toán lượng calo đã đốt cháy
- ✅ Đồng hồ bấm giờ
- ✅ Tùy chỉnh chiều dài bước và cân nặng
- ✅ Giao diện thân thiện với thiết bị di động

## Cách sử dụng

1. Mở file `index.html` trong trình duyệt web
2. Nhấn nút **"Bắt đầu"** để bắt đầu đếm bước
3. Đi bộ với thiết bị di động (điện thoại/máy tính bảng)
4. Ứng dụng sẽ tự động phát hiện và đếm các bước chân
5. Nhấn **"Tạm dừng"** để dừng đếm
6. Nhấn **"Đặt lại"** để reset về 0

## Cài đặt

### Chiều dài bước (cm)
- Điều chỉnh theo chiều dài bước chân của bạn
- Mặc định: 75cm
- Phạm vi: 50-100cm

### Cân nặng (kg)
- Nhập cân nặng của bạn để tính calo chính xác hơn
- Mặc định: 70kg
- Phạm vi: 30-200kg

## Yêu cầu kỹ thuật

- Trình duyệt web hiện đại hỗ trợ DeviceMotion API
- Thiết bị có cảm biến gia tốc kế (accelerometer)
- Tốt nhất: Sử dụng trên điện thoại di động hoặc máy tính bảng

## Thử nghiệm trên Desktop

Khi chạy trên máy tính không có cảm biến chuyển động:
- Nhấn phím **Space** để mô phỏng một bước chân

## Công nghệ

- HTML5
- CSS3 (Responsive Design)
- Vanilla JavaScript
- DeviceMotion API

## License

MIT