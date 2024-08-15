# 🛠️ XÂY DỰNG HỆ THỐNG LOG HOẠT ĐỘNG NGƯỜI DÙNG

## 📖 Giới Thiệu

Hệ thống log hoạt động người dùng được phát triển nhằm ghi nhận các hoạt động **Thêm**, **Sửa**, và **Xoá mềm** (trạng thái là `DELETED` hoặc `CANCELED`) trên một số bảng cần log và hiển thị thông tin log đó. Ngoài ra, hệ thống có khả năng mở rộng để ghi nhận thêm các hoạt động xoá hoàn toàn.

## 💻 Công Nghệ Sử Dụng

- **ReactJS**: Framework cho frontend, giúp tạo ra các giao diện người dùng tương tác.
- **Java Spring Boot**: Framework mạnh mẽ để phát triển backend, cung cấp các API cho hệ thống.
- **PostgreSQL**: Hệ quản trị cơ sở dữ liệu quan hệ, được sử dụng để lưu trữ và quản lý dữ liệu log.

## ⚙️ Các Bước Cài Đặt

### 1. Giải Nén File

Trước tiên, bạn cần giải nén file chứa mã nguồn của dự án vào một thư mục trên máy tính.

### 2. Chạy Frontend

1. **Mở terminal** và thực hiện lệnh sau để chuyển vào thư mục của dự án:

    ```bash
    cd SystemLog
    ```

2. **Cài đặt các gói phụ thuộc** cần thiết cho dự án bằng lệnh:

    ```bash
    npm install
    ```

3. **Khởi động ứng dụng** bằng lệnh:

    ```bash
    npm start
    ```

   Ứng dụng sẽ được khởi chạy tại địa chỉ [http://localhost:3000](http://localhost:3000) theo mặc định. Mở trình duyệt của bạn và truy cập địa chỉ này để xem giao diện ứng dụng.

### 3. Import Database

1. **Tạo một database** mới với tên là `NewSystemLog` trong PostgreSQL.
2. **Chạy các lệnh SQL** có trong file `SystemLog.sql` để tạo bảng và dữ liệu mẫu.

### 4. Chạy Backend

1. Mở file `application.yml` trong thư mục backend và **nhập lại mật khẩu PostgreSQL** của bạn.
2. Chạy chương trình backend. Sau khi chạy thành công, hãy kiểm tra xem cơ sở dữ liệu có xuất hiện trên giao diện web hay không. Nếu xuất hiện, bạn đã thiết lập thành công!

## 📧 Liên Hệ

Nếu bạn gặp phải bất kỳ vấn đề nào hoặc có câu hỏi liên quan đến dự án, vui lòng liên hệ với chúng tôi qua email:

- **Hieu Le**: [hieu.le0811@hcmut.edu.vn](mailto:hieu.le0811@hcmut.edu.vn)
- **Pham Nhat Linh**: [phamnhattuong001@gmail.com](mailto:phamnhattuong001@gmail.com)
- **Nha Truong**: [nha.truonghcmutk21@hcmut.edu.vn](mailto:nha.truonghcmutk21@hcmut.edu.vn)

---

Cảm ơn bạn đã quan tâm đến dự án của chúng tôi! 🌟
