document.addEventListener('DOMContentLoaded', async (event) => {

    addLoginEventListener("userlogin", () => document.getElementById('floatingInput').value, () => document.getElementById('floatingPassword').value);
    addLoginEventListener("adminlogin", () => 'admin@admin.com', () => document.getElementById('adminPassword').value);

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

            const response = await fetch('/user/register', {
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
        const response = await fetch('/card/random_cards', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const cards = await response.json();
            await addCards(cards);
            setTimeout(async function () {
                await paintCards();
                await useMasonry();
            }, 500);

        }
    } catch (err) {
        console.error(err);
    }
});

async function login(email, password) {
    try {
        const response = await fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (data.token) {
            localStorage.setItem('token', data.token);
            const storedToken = localStorage.getItem('token');
            console.log('Stored token:', storedToken);

            alert('Login successful');
            window.location.href = "/private.html";
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
    }
}

function addLoginEventListener(buttonId, getEmail, getPassword) {
    const button = document.getElementById(buttonId);
    button.addEventListener('click', async function () {
        const email = getEmail();
        const password = getPassword();

        if (!email || !password) {
            alert("All fields are required");
            return;
        }
        await login(email, password);
    });
}

async function addCards(cards) {

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
                            <h5 class="card-text">${new Date(card.date).toLocaleDateString()}</h5>
                            <p class="card-text">${card.description}</p>
                            <p class="card-text"><small>created by ${card.user_email}</small></p>
                        </div>
                    </div>
                `;
        cardContainer.appendChild(cardElement);
    });

}

async function useMasonry() {
    var msnry = new Masonry(document.getElementById('card-contents'), {
        percentPosition: true
    });
}

async function paintCards() {
    var colors = ['bg-primary text-white', 'bg-secondary text-white', 'bg-success text-white', 'bg-danger text-white', 'bg-warning text-dark', 'bg-info text-dark', 'bg-light text-dark', 'bg-dark text-white'];

    var cards = document.querySelectorAll('.card-body');

    cards.forEach(function (card) {
        var color = colors[Math.floor(Math.random() * colors.length)];
        var classes = color.split(' ');

        card.classList.add(...classes);
    });
}
