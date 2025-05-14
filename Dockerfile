# Sử dụng Node.js image chính thức
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng server đang dùng (nếu bạn dùng 3000)
EXPOSE 3000

# Lệnh chạy server
CMD ["node", "server.js"]
