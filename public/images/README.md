# Ảnh mặc định sản phẩm (theo danh mục)

Mỗi danh mục một ảnh mặc định khi sản phẩm không có ảnh. Đặt file **.jpg** trong thư mục này:

- **default-product-{category_id}.jpg** — ảnh riêng theo từng danh mục.

Ví dụ (đã có sẵn):

- `default-product-pesticides.jpg` — Thuốc trừ sâu
- `default-product-fertilizers.jpg` — Phân bón
- `default-product-plant-protection.jpg` — Bảo vệ thực vật
- `default-product-bio.jpg` — Sinh học / Bio

Tên file = `default-product-` + **id danh mục** (chữ thường, không dấu). Nếu không có file theo category, app dùng `default-product-pesticides.jpg`.
