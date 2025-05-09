let cartItems = [];
let totalPrice = 0;

// Thông tin sản phẩm
const products = {
    1: { name: "Chuck Taylor All Star Classic - 127440", price: 1459000 },
    2: { name: "Chuck Taylor All Star Pro - 127450", price: 1799000 }
};

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(result => {
        if (result.message === "Đăng nhập thành công") {
            alert("✅ " + result.message);
            // Chuyển hướng tới home.html
            window.location.href = "/html/home.html";
        } else {
            alert("❌ " + result.message);
        }
    })
    .catch(err => {
        alert("Lỗi đăng nhập: " + err.message);
    });
});

// Tải danh sách giỏ hàng khi trang được mở
fetch('http://localhost:3000/cart')
    .then(response => response.json())
    .then(data => {
        cartItems = data.map(item => ({
            id: item.id,
            productId: item.id,
            name: item.product_name,
            price: item.price,
            quantity: item.quantity
        }));
        updateCartDisplay();
    });

// Hàm thêm sản phẩm vào giỏ
function addToCart(productId) {
    const quantity = parseInt(document.getElementById(`quantity${productId}`).value);
    if (quantity <= 0) {
        alert("Số lượng phải lớn hơn 0!");
        return;
    }

    const product = {
        product_name: products[productId].name,
        price: products[productId].price,
        quantity: quantity
    };

    fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
    .then(response => response.json())
    .then(data => {
        cartItems.push({
            id: data.id,
            productId: productId,
            name: product.product_name,
            price: product.price,
            quantity: product.quantity
        });
        updateCartDisplay();
    });
}

// Hàm cập nhật hiển thị giỏ hàng và tổng tiền
function updateCartDisplay() {
    const cartDiv = document.getElementById('cartItems');
    cartDiv.innerHTML = '';
    totalPrice = 0;

    cartItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'border-b py-2';
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        itemDiv.innerHTML = `
            <p>${item.name}</p>
            <p>${itemTotal.toLocaleString()}₫ (x${item.quantity})</p>
            <input type="number" value="${item.quantity}" min="0" class="w-16 border rounded px-2 py-1" onchange="updateQuantity(${item.id}, this.value)">
        `;
        cartDiv.appendChild(itemDiv);
    });

    document.getElementById('totalPrice').textContent = `${totalPrice.toLocaleString()}₫`;
}

// Hàm cập nhật số lượng sản phẩm
function updateQuantity(itemId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    fetch(`http://localhost:3000/cart/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
    })
    .then(response => response.json())
    .then(data => {
        if (newQuantity === 0) {
            cartItems = cartItems.filter(item => item.id !== itemId);
        } else {
            const item = cartItems.find(item => item.id === itemId);
            item.quantity = newQuantity;
        }
        updateCartDisplay();
    });
}
if (result.message === "Đăng nhập thành công") {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("cartCount", "0"); // nếu chưa có
    window.location.href = "/html/home.html"; // chuyển hướng
}