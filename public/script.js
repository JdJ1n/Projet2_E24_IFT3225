

document.addEventListener('DOMContentLoaded', (event) => {
    var userlogin = document.getElementById("userlogin");//btn
    var adminlogin = document.getElementById("adminlogin");//btn

    userlogin.addEventListener('click', async function () {
        const email = document.getElementById('floatingInput').value;
        const password = document.getElementById('floatingPassword').value;

        if (!email || !password) {
            alert("All fields are required");
            return;
        }

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (data.token) {
            localStorage.setItem('token', data.token);
            alert('Login successful');
            //customize here
            window.location.href = "user_page.html";
        } else {
            alert(data.message);
        }
    });

    adminlogin.addEventListener('click', async function () {
        const password = document.getElementById('adminPassword').value;
        const email = 'admin@admin.com'; 

        if (!password) {
            alert("Password is required");
            return;
        }

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (data.token) {
            localStorage.setItem('token', data.token);
            alert('Admin Login successful');
            //customize here
            window.location.href = "admin_page.html";
        } else {
            alert(data.message);
        }
    });

    document.getElementById("userSignup").addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('floatingInput').value;
        const password = document.getElementById('floatingPassword').value;

        if (!email || !password) {
            alert("All fields are required");
            return;
        }

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: email, email, password })
        });
        const data = await response.json();
        alert(data.message);
    });

    var colors = ['bg-primary text-white', 'bg-secondary text-white', 'bg-success text-white', 'bg-danger text-white', 'bg-warning text-dark', 'bg-info text-dark', 'bg-light text-dark', 'bg-dark text-white'];

    var cards = document.querySelectorAll('.card-body');

    cards.forEach(function(card) {
        var color = colors[Math.floor(Math.random() * colors.length)];
        var classes = color.split(' ');

        card.classList.add(...classes);
    });
});


