// document.addEventListener('DOMContentLoaded', (event) => {

//     var userlogin = document.getElementById("userlogin");

//     userlogin.addEventListener('click', function () {
//     window.location.href = "user_page.html";
//     });

//     var adminlogin = document.getElementById("adminlogin");

//     adminlogin.addEventListener('click', function () {
//     window.location.href = "admin_page.html";
//     });

//     var colors = ['bg-primary text-white', 'bg-secondary text-white', 'bg-success text-white', 'bg-danger text-white', 'bg-warning text-dark', 'bg-info text-dark', 'bg-light text-dark', 'bg-dark text-white'];

//     var cards = document.querySelectorAll('.card-body');

//     cards.forEach(function(card) {
//         var color = colors[Math.floor(Math.random() * colors.length)];
//         var classes = color.split(' ');

//         card.classList.add(...classes);
//     });

//     });

document.addEventListener('DOMContentLoaded', (event) => {
    var userlogin = document.getElementById("userlogin");

    userlogin.addEventListener('click', async function () {
        const email = document.getElementById('floatingInput').value;
        const password = document.getElementById('floatingPassword').value;

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
            fetchTasks();
            window.location.href = "user_page.html";
        } else {
            alert(data.message);
        }
    });

    var adminlogin = document.getElementById("adminlogin");

    adminlogin.addEventListener('click', async function () {
        const email = document.getElementById('floatingInput').value;
        const password = document.getElementById('floatingPassword').value;

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
            fetchTasks();
            window.location.href = "admin_page.html";
        } else {
            alert(data.message);
        }
    });

    document.querySelector('.btn-primary[type="submit"]').addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('floatingInput').value;
        const password = document.getElementById('floatingPassword').value;

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

    async function fetchTasks() {
        const token = localStorage.getItem('token');
        const response = await fetch('/tasks', {
            headers: {
                'Authorization': token
            }
        });
        const tasks = await response.json();
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = tasks.map(task => `
            <div class="col-sm-6 col-lg-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">${task.title}</h4>
                        <h5 class="card-text">${task.category}</h5>
                        <p class="card-text">${task.description}</p>
                        <p class="card-text"><small>created by ${task.user_id}</small></p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    var colors = ['bg-primary text-white', 'bg-secondary text-white', 'bg-success text-white', 'bg-danger text-white', 'bg-warning text-dark', 'bg-info text-dark', 'bg-light text-dark', 'bg-dark text-white'];

    var cards = document.querySelectorAll('.card-body');

    cards.forEach(function(card) {
        var color = colors[Math.floor(Math.random() * colors.length)];
        var classes = color.split(' ');

        card.classList.add(...classes);
    });
});
