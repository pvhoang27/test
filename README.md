# Ứng dụng Đo Bước Chân (Step Counter App) 🚶‍♂️

Ứng dụng web đơn giản để đếm số bước chân của bạn sử dụng cảm biến chuyển động trên thiết bị di động.

## Tính năng

- ✅ Đếm bước chân tự động sử dụng cảm biến gia tốc
- ✅ Hiển thị khoảng cách đã đi (km)
- ✅ Tính toán lượng calories tiêu thụ
- ✅ Lưu trữ dữ liệu cục bộ (LocalStorage)
- ✅ Lịch sử hoạt động trong ngày
- ✅ Giao diện thân thiện với thiết bị di động
- ✅ Hỗ trợ tiếng Việt

## Cách sử dụng

1. Mở file `index.html` trên thiết bị di động của bạn
2. Nhấn nút "Bắt đầu" để bắt đầu đếm bước
3. Mang theo điện thoại và di chuyển
4. Ứng dụng sẽ tự động đếm số bước của bạn
5. Nhấn "Tạm dừng" để tạm dừng đếm
6. Nhấn "Đặt lại" để reset bộ đếm

## Yêu cầu kỹ thuật

- Thiết bị di động có cảm biến gia tốc (accelerometer)
- Trình duyệt web hiện đại (Chrome, Safari, Firefox, Edge)
- Đối với iOS 13+: Cần cấp quyền truy cập cảm biến chuyển động

## Cài đặt

Không cần cài đặt! Chỉ cần mở file `index.html` trên trình duyệt.

### Chạy trên máy chủ cục bộ (tùy chọn)

```bash
# Sử dụng Python
python -m http.server 8000

# Hoặc Node.js
npx http-server
```

Sau đó truy cập: `http://localhost:8000`

## Cấu trúc dự án

```
.
├── index.html      # Trang HTML chính
├── style.css       # Stylesheet
├── app.js          # Logic ứng dụng JavaScript
└── README.md       # Tài liệu này
```

## Lưu ý

- Ứng dụng hoạt động tốt nhất trên thiết bị di động thực tế
- Cảm biến chuyển động có thể không có sẵn trên máy tính để bàn
- Dữ liệu được lưu theo ngày và sẽ tự động reset vào ngày mới
- Độ chính xác phụ thuộc vào cảm biến của thiết bị

## Công nghệ sử dụng

- HTML5
- CSS3 (Flexbox, Gradients, Animations)
- JavaScript (ES6+)
- DeviceMotion API
- LocalStorage API

## Tương lai

- [ ] Biểu đồ thống kê theo tuần/tháng
- [ ] Đặt mục tiêu hàng ngày
- [ ] Thông báo khi đạt mục tiêu
- [ ] Xuất dữ liệu

---

Made with ❤️ for health and fitness