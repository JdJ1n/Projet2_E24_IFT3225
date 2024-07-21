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

    var _showUsersCards = false;

    const token = localStorage.getItem('token');
    loadPage(token);

    Object.defineProperty(window, 'showUsersCards', {
        get: function () {
            return _showUsersCards;
        },
        set: async function (value) {
            _showUsersCards = value;
            await updatePage(token);
        }
    });
});

async function loadPage(token) {
    console.log("Page loading...")

    const active_user = await getActiveUser(token);

    var perPage = 15;

    await loadLogoutButton();

    await loadBar(active_user);

    await updatePage(token);

    //var addElement = document.getElementById("add");

    console.log("Page loaded!")
}

async function updatePage(token) {
    const active_user = await getActiveUser(token);
    const all_cards = await allCards(token);
    await updateContents(active_user, all_cards);
    await paintCards();
}

async function addNavBar() {
    var usersCardsLink = document.getElementById('usersCards');
    var allCardsLink = document.getElementById('userPageAllCards');
    function handleUsersCardsClick() {
        showUsersCards = true;
        this.classList.add('active');
        allCardsLink.classList.remove('active');
    }

    function handleAllCardsClick() {
        showUsersCards = false;
        this.classList.add('active');
        usersCardsLink.classList.remove('active');
    }
    usersCardsLink.addEventListener('click', handleUsersCardsClick);
    allCardsLink.addEventListener('click', handleAllCardsClick);
}

async function getActiveUser(token) {
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

async function loadBar(activeUser) {
    document.getElementById("welcomeBar").innerHTML = `
        <h1>Bonjour, ${activeUser.username}</h1>
        <p class="lead">Bienvenue dans le monde des albums de musique !</p>
    `;
    if (activeUser.role === "admin") {
        loadAdminBar();
    } else if (activeUser.role === "user") {
        loadUserBar();
    }
}

async function loadAdminBar() {
    document.getElementById("top-navbar").innerHTML = `
          <li class="nav-item">
            <a class="nav-link disabled">Vos tuiles</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active">Toutes les tuiles</a>
          </li>`;
}

async function loadUserBar() {
    document.getElementById("top-navbar").innerHTML = `
          <li class="nav-item">
            <a class="nav-link" id="usersCards">Vos tuiles</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" id="userPageAllCards">Toutes les tuiles</a>
          </li>`;
    await addNavBar();
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

async function updateContents(activeUser, display_cards,currentPage) {
    const cardContainer = document.getElementById('card-contents');
    while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild);
    }
    if (activeUser.role === 'admin') {
        display_cards.forEach(card => {
            const cardElement = createEditableCard(card)
            cardContainer.appendChild(cardElement);
        });

    } else if (activeUser.role === 'user') {
        if (showUsersCards) {
            while (cardContainer.firstChild) {
                cardContainer.removeChild(cardContainer.firstChild);
            }
            display_cards.forEach(card => {
                if (card.used_id === activeUser.id) {
                    const cardElement = createEditableCard(card);
                    cardContainer.appendChild(cardElement);
                }
            });
            cardContainer.appendChild(addElement());
        } else {
            display_cards.forEach(card => {
                if (card.used_id === activeUser.id) {
                    const cardElement = createEditableCard(card);
                    cardContainer.appendChild(cardElement);
                } else {
                    const cardElement = createCard(card);
                    cardContainer.appendChild(cardElement);
                }
            });

        }
    }

}

function addElement() {
    const cardElement = document.createElement('div');
    cardElement.className = 'col-sm-6 col-lg-4 mb-4 rounded';
    cardElement.innerHTML = `
          <div class="card">
            <div class="btn btn-sm btn-outline-secondary">
              <a id="add" data-bs-toggle="modal" data-bs-target="#modalAddCard" href="#"
                class="stretched-link card-text" aria-label="Add"
                style="text-decoration: none; color: inherit; font-size: 2rem;">
                +
                <span class="visually-hidden">Add</span>
              </a>
            </div>
          </div>
                `;
    return cardElement;
}

function createCard(card) {
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

function createEditableCard(card) {
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
                            <!-- options for edit start -->
                            <div class="d-flex justify-content-between align-items-center">
                                <button id="Edit_${card.id}" type="button" class="btn btn-sm btn-secondary" aria-label="Edit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                    <path
                                    d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                                </svg>
                                <span class="visually-hidden">Edit</span>
                                </button>
                                <button id="Delete_${card.id}" type="button" class="btn btn-sm btn-secondary" aria-label="Delete">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
                                    viewBox="0 0 16 16">
                                    <path
                                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path
                                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                                <span class="visually-hidden">Delete</span>
                                </button>
                            </div>
                            <!-- options for edit end -->
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

async function allCards(token) {
    try {
        const response = await fetch('/card/all_cards', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const cards = await response.json();
            return cards
        }
    } catch (err) {
        console.error(err);
    }
}


/*
// 假设你已经从后端获取了所有的数据，并将其存储在了一个名为allData的数组中
var allData = [...]; // 从后端获取的所有数据
var perPage = 10; // 每页显示的数据数量

// 计算总页数
var totalPages = Math.ceil(allData.length / perPage);

// 生成分页按钮
var pagination = document.querySelector('.pagination');
for (var i = 1; i <= totalPages; i++) {
    var li = document.createElement('li');
    li.className = 'page-item';
    var a = document.createElement('a');
    a.className = 'page-link';
    a.textContent = i;
    a.href = '#';
    li.appendChild(a);
    pagination.appendChild(li);
}

// 显示第一页的数据
showPage(1);

// 为每个分页按钮添加点击事件
var pageLinks = document.querySelectorAll('.page-link');
pageLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // 获取被点击的页码
        var pageNum = parseInt(this.textContent);

        // 移除所有分页按钮的active类
        var pageItems = document.querySelectorAll('.page-item');
        pageItems.forEach(function(item) {
            item.classList.remove('active');
        });

        // 给被点击的分页按钮添加active类
        this.parentNode.classList.add('active');

        // 显示对应页码的数据
        showPage(pageNum);
    });
});

// 显示指定页码的数据
function showPage(pageNum) {
    var start = (pageNum - 1) * perPage;
    var end = start + perPage;
    var pageData = allData.slice(start, end);

    // 这里添加显示数据的代码
    // 例如，你可以将数据添加到一个表格或列表中
    // var table = document.querySelector('#data-table');
    // table.innerHTML = '';
    // pageData.forEach(function(item) {
    //     var row = document.createElement('tr');
    //     // 这里添加创建表格行的代码
    //     table.appendChild(row);
    // });
}

*/
