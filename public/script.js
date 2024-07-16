document.addEventListener('DOMContentLoaded', (event) => {

    var userlogin = document.getElementById("userlogin");

    userlogin.addEventListener('click', function () {
    window.location.href = "user_page.html";
    });

    var adminlogin = document.getElementById("adminlogin");

    adminlogin.addEventListener('click', function () {
    window.location.href = "admin_page.html";
    });

    });