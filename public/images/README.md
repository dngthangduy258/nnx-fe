# Ảnh mặc định sản phẩm (theo danh mục)

Mỗi danh mục một ảnh mặc định khi sản phẩm không có ảnh. Đặt file trong thư mục này:

- **default-product.png** — ảnh dùng chung khi không có ảnh theo category (fallback).
- **default-product-{category_id}.png** — ảnh riêng theo từng danh mục.

Ví dụ (category id trong hệ thống):

- `default-product-pesticides.png` — Thuốc trừ sâu
- `default-product-fertilizers.png` — Phân bón
- `default-product-plant-protection.png` — Bảo vệ thực vật

Tên file = `default-product-` + **id danh mục** (chữ thường, không dấu, không khoảng trắng). Nếu không có file theo category, app sẽ dùng `default-product.png`.
