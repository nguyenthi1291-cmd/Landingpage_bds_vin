# Implementation Instructions

## HTML

Tạo file:

`index.html`

Sử dụng semantic HTML5:

- header
- nav
- main
- section
- footer

## Bootstrap

Sử dụng Bootstrap 5 qua CDN.

Bootstrap CSS đặt trong `<head>`.

Bootstrap JavaScript Bundle đặt trước `</body>`.

Không tải Bootstrap bằng npm.

## CSS

Nếu cần CSS riêng:

`style.css`

Các custom style phải được đặt trong file này.

Không viết CSS quá dài nếu Bootstrap có thể xử lý.

Có thể dùng CSS Variables:

```css
:root {
  --primary-color: #2d2d86;
  --background-color: #f2f2f2;
  --dark-color: #2d2d2d;
}