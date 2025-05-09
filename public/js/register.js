document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const data = {
        fullname: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        alert(result.message || "Đăng ký thành công!");
        window.location.href = "/html/index.html"; // hoặc login.html
    })
    .catch(err => {
        alert("Lỗi: " + err.message);
    });
});
