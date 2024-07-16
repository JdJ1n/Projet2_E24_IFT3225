document.addEventListener('DOMContentLoaded', (event) => {

    var userlogin = document.getElementById("userlogin");

    userlogin.addEventListener('click', function () {
    window.location.href = "user_page.html";
    });

    var adminlogin = document.getElementById("adminlogin");

    adminlogin.addEventListener('click', function () {
    window.location.href = "admin_page.html";
    });

    var colors = ['bg-primary text-white', 'bg-secondary text-white', 'bg-success text-white', 'bg-danger text-white', 'bg-warning text-dark', 'bg-info text-dark', 'bg-light text-dark', 'bg-dark text-white'];

    var cards = document.querySelectorAll('.card-body');

    cards.forEach(function(card) {
        var color = colors[Math.floor(Math.random() * colors.length)];
        var classes = color.split(' ');

        card.classList.add(...classes);
    });

    });