document.addEventListener('DOMContentLoaded', async (event) => {

    try {
        console.log("Token check start.")
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Access denied.');
            window.location.href = 'index.html';
            return;
        }
        console.log("Auth start.")
        const response = await fetch('/user/user_page', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        console.log("Auth finished.")
        if (response.ok) {
            console.log("Page start to load.");
        } else {
            const errorData = await response.json();
            console.error('Failed to load page:', errorData.message);
            alert('Failed to load page: ' + errorData.message);
            window.location.href = 'index.html';
            return;
        }
    } catch (err) {
        console.error('Failed to load page:', err);
        alert('An error occurred while loading the page. Please try again later.');
        window.location.href = 'index.html';
        return;
    }

    loadPage();

});

async function loadPage() {
    console.log("Page loading...")

    const active_user = await getActiveUser();

    await loadLogoutButton();

    await loadContent(active_user);

    await paintCards();

    var addElement = document.getElementById("add");

    console.log("Page loaded!")
}

async function getActiveUser() {
    const token = localStorage.getItem('token');
    const active_user_response = await fetch('/user/active_user', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (active_user_response.ok) {
        var active_user = await active_user_response.json();
        return active_user;
    } else {
        console.log("Failed to get active user data");
        return null;
    }
}

async function loadContent(activeUser) {
    document.getElementById("welcomeBar").innerHTML=`
        <h1>Bonjour, ${activeUser.username}</h1>
        <p class="lead">Bienvenue dans le monde des albums de musique !</p>
    `;
    if (activeUser.role === "admin") {
        loadAdminContent(activeUser);
    } else if (activeUser.role === "user") {
        loadUserContent(activeUser);
    }
}

async function loadAdminContent(activeUser) {
    document.getElementById("top-navbar").innerHTML = `
          <li class="nav-item">
            <a class="nav-link disabled">Vos tuiles</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="#">Toutes les tuiles</a>
          </li>
    `;
}

async function loadUserContent(activeUser) {
    document.getElementById("top-navbar").innerHTML = `
          <li class="nav-item">
            <a class="nav-link" id="usersCards">Vos tuiles</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" id="userPageAllCards">Toutes les tuiles</a>
          </li>`;
    const showUsersCards=false;

}

async function loadLogoutButton() {
    var backtologin = document.getElementById("logout");

    backtologin.addEventListener('click', async function () {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/user/logout', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.ok) {
                localStorage.removeItem('token');
                window.location.href = "index.html";
            } else {
                const errorData = await response.json();
                alert('Failed to log out: ' + errorData.message);
            }
        } catch (err) {
            console.error('Failed to log out:', err);
            alert('An error occurred while logging out. Please try again later.');
        }
    });
}

function createdCard(card) {
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
    return cardElement;
}

async function paintCards() {
    var colors = ['bg-primary text-white', 'bg-success text-white', 'bg-danger text-white', 'bg-warning text-dark', 'bg-info text-dark', 'bg-light text-dark', 'bg-dark text-white'];

    var cards = document.querySelectorAll('.card-body');

    cards.forEach(function (card) {
        var color = colors[Math.floor(Math.random() * colors.length)];
        var classes = color.split(' ');

        card.classList.add(...classes);
    });
}
