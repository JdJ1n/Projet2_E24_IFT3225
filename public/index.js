document.addEventListener('DOMContentLoaded', async (event) => {

    async function clearTokens() {
        try {
            // Send a request to the server to clear all authTokens in the database
            await fetch('/clear-tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Clear the token in the localStorage
            localStorage.removeItem('token');
        } catch (err) {
            console.error(err);
        }
    }
    // Call the function to clear tokens
    clearTokens();

    async function login(email,password) {
        try {
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
                // Redirect to the server route instead of the file
                window.location.href = "/private.html";
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    }

    var userlogin = document.getElementById("userlogin");//btn
    var adminlogin = document.getElementById("adminlogin");//btn

    userlogin.addEventListener('click', async function () {
            const email = document.getElementById('floatingInput').value;
            const password = document.getElementById('floatingPassword').value;
    
            if (!email || !password) {
                alert("All fields are required");
                return;
            }
            login(email,password);
    });
    
    adminlogin.addEventListener('click', async function () {
        
            const password = document.getElementById('adminPassword').value;
            const email = 'admin@admin.com'; 
    
            if (!password) {
                alert("Password is required");
                return;
            }
    
            login(email,password);
    });
    

    document.getElementById("userSignup").addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const email = document.getElementById('floatingInput').value;
            const password = document.getElementById('floatingPassword').value;
    
            if (!email || !password) {
                alert("All fields are required");
                return;
            }
    
            // Email format check
            const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
            if (!emailRegex.test(email)) {
                alert("Invalid email format");
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
        } catch (err) {
            console.error(err);
        }
    });
    

    try {
        const response = await fetch('/random-cards', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const cards = await response.json();
            const cardContainer = document.getElementById('card-contents');
    
            cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = 'col-sm-6 col-lg-4 mb-4 rounded';
                cardElement.innerHTML = `
                    <div class="card rounded">
                        <div class="bd-placeholder-img card-img-top">
                            <img class="rounded-top" src=${card.url} alt="${card.name} - ${card.artist}" height="100%" width="100%" class="bd-placeholder-img">
                        </div>
                        <div class="card-body rounded-bottom">
                            <h4 class="card-title">${card.name} - ${card.artist}</h4>
                            <h5 class="card-text">${card.category_name}</h5>
                            <p class="card-text">${card.description}</p>
                            <p class="card-text"><small>created by ${card.user_email}</small></p>
                        </div>
                    </div>
                `;
                cardContainer.appendChild(cardElement);
            });

            var colors = ['bg-primary text-white', 'bg-secondary text-white', 'bg-success text-white', 'bg-danger text-white', 'bg-warning text-dark', 'bg-info text-dark', 'bg-light text-dark', 'bg-dark text-white'];
            var cardbgs = document.querySelectorAll('.card-body');

            cardbgs.forEach(function(card) {
            var color = colors[Math.floor(Math.random() * colors.length)];
            var classes = color.split(' ');

            card.classList.add(...classes);
            });

        }
    } catch (err) {
        console.error(err);
    }
});
