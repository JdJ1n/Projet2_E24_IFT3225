

document.addEventListener('DOMContentLoaded', async (event) => {
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


    try {
        const response = await fetch('/random-cards');
        const cards = await response.json();

        const cardContainer = document.getElementById('card-contents');

        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'col-sm-6 col-lg-4 mb-4 rounded';
            cardElement.innerHTML = `
                <div class="card rounded">
                    <div class="bd-placeholder-img card-img-top">
                        <img class="rounded-top" src=${card.url} alt="${card.name}" height="100%" width="100%" class="bd-placeholder-img">
                    </div>
                    <div class="card-body rounded-bottom">
                        <h4 class="card-title">${card.name}</h4>
                        <h5 class="card-text">${card.category_id}</h5>
                        <p class="card-text">${card.description}</p>
                        <p class="card-text"><small>created by ${card.user_id}</small></p>
                    </div>
                </div>
            `;
            cardContainer.appendChild(cardElement);
        });
    } catch (err) {
        console.error(err);
    }
    

    

    
});


