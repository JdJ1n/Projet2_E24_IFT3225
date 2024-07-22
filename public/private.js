document.addEventListener('DOMContentLoaded', async (event) => {

    //Auth before load page
    await authentification();

    console.log("Page loading...")

    var _showUsersCards = false;

    await loadLogoutButton();

    await loadBar();

    Object.defineProperty(window, 'showUsersCards', {
        get: function () {
            return _showUsersCards;
        },
        set: async function (value) {
            _showUsersCards = value;
            document.getElementById("resetButton").click();
        }
    });

    //main function for update page
    await showCurrentContents();

    document.getElementById("searchButton").addEventListener('click', async (e) => {
        //Apply current attrs for search
        await showCurrentContents();
    })

    document.getElementById("resetButton").addEventListener('click', async (e) => {
        //reset here
        await showCurrentContents();
    })

    console.log("Page loaded!")
});

async function authentification() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Access denied.');
            window.location.href = 'index.html';
            return;
        }
        const response = await fetch('/user/user_page', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (response.ok) {
            console.log("Authentification success.");
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
}

async function showCurrentContents() {
    await authentification();
    const token = localStorage.getItem('token');
    await clearPagis();
    const active_user = await getActiveUser(token);
    const all_cards = await allCards(token);
    const perPage = 15;

    const display_cards = await cardFilter(active_user, all_cards);

    var totalPages = Math.ceil(display_cards.length / perPage);
    const pagination = document.querySelector('.pagination');

    for (var i = 1; i <= totalPages; i++) {
        var li = document.createElement('li');
        li.className = 'page-item';
        if (i === 1) {
            li.classList.add('active');
        }
        var a = document.createElement('a');
        a.className = 'page-link';
        a.textContent = i;
        a.href = '#';
        li.appendChild(a);
        pagination.appendChild(li);
    }

    // showPage1
    showPage(active_user, display_cards, 1);

    // add listeners for paginations
    var pageLinks = document.querySelectorAll('.page-link');
    pageLinks.forEach(function (link) {
        link.addEventListener('click', async function (e) {
            e.preventDefault();

            // get page btn clicked
            var pageNum = parseInt(this.textContent);

            // reset other pagination btns
            var pageItems = document.querySelectorAll('.page-item');
            pageItems.forEach(function (item) {
                item.classList.remove('active');
                item.removeAttribute('tabindex');
            });

            // set selected btn
            this.parentNode.classList.add('active');
            this.parentNode.setAttribute('tabindex', '-1');
            await showPage(active_user, display_cards, pageNum);
        });
    });

    async function showPage(active_user, display_cards, pageNum) {
        await clearCards();
        await authentification();
        var start = (pageNum - 1) * 15;
        var end = start + 15;
        var page_cards = display_cards.slice(start, end);

        if (active_user.role === 'user' && showUsersCards) {
            await addElement();
        }
        page_cards.forEach(async card => {
            if (active_user.role === 'user' && card.user_id != active_user.id) {
                await createCard(card);
            } else {
                await createEditableCard(card);
            }
        });

        setTimeout(async function () {
            await paintCards();
            await useMasonry();
        }, 200);
    }

}

async function cardFilter(active_user, cards) {
    const option1 = document.getElementById('methodSelect').value;
    const option2 = document.getElementById('attrSelect').value;
    if (active_user.role === 'user' && showUsersCards) {
        const filtered_cards = cards.filter(card => card.user_id == active_user.id);
        return filtered_cards;
    }
    return cards;
}

async function createCard(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'col-sm-6 col-lg-4 mb-4 rounded';
    cardElement.innerHTML = `
    <div class="card rounded">
    <div class="bd-placeholder-img card-img-top">
        <img class="rounded-top" src=${card.url} alt="${card.name} - ${card.artist}" height="100%" width="100%" class="bd-placeholder-img" onerror="this.onerror=null; this.src='images/Default.png';"></div>
    <div class="card-body rounded-bottom">
        <h4 class="card-title">${card.name} - ${card.artist}</h4>
        <h5 class="card-text">${card.category_name}</h5>
        <h5 class="card-text">${new Date(card.date).toLocaleDateString()}</h5>
        <p class="card-text">${card.description}</p>
        <p class="card-text">
        <small>created by ${card.user_email}</small></p>
    </div>
    </div>
    `;

    document.getElementById('card-contents').appendChild(cardElement);
}

async function createEditableCard(card) {
    const active_user = await getActiveUser(localStorage.getItem('token'));
    const cardElement = document.createElement('div');
    cardElement.className = 'col-sm-6 col-lg-4 mb-4 rounded';
    cardElement.innerHTML = `
    <div class="card rounded">
        <div class="bd-placeholder-img card-img-top">
            <img class="rounded-top" src=${card.url} alt="${card.name} - ${card.artist}" height="100%" width="100%" class="bd-placeholder-img" onerror="this.onerror=null; this.src='images/Default.png';"></div>
        <div class="card-body rounded-bottom">
            <h4 class="card-title">${card.name} - ${card.artist}</h4>
            <h5 class="card-text">${card.category_name}</h5>
            <h5 class="card-text">${new Date(card.date).toLocaleDateString()}</h5>
            <p class="card-text">${card.description}</p>
            <p class="card-text">
            <small>created by ${card.user_email}</small></p>
            <!-- options for edit start -->
            <div class="d-flex justify-content-between align-items-center">
            <button id="Edit_${card.id}" type="button" class="btn btn-sm btn-secondary" aria-label="Edit" data-bs-toggle="modal" data-bs-target="#modalEditCard${card.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" /></svg>
                <span class="visually-hidden">Edit</span></button>
            <button id="Delete_${card.id}" type="button" class="btn btn-sm btn-secondary" aria-label="Delete" data-bs-toggle="modal" data-bs-target="#modalDeleteCard${card.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" /></svg>
                <span class="visually-hidden">Delete</span></button>
            </div>
        </div>
    </div>
    `;

    const all_categories = await allCategories();
    const editCardForm = document.createElement('div');
    editCardForm.className = 'modal fade p-5';
    editCardForm.id = `modalEditCard${card.id}`;
    editCardForm.role = 'dialog';
    editCardForm.tabindex = '-1';
    editCardForm.innerHTML = `
    <div class="modal-dialog" role="document">
    <div class="modal-content rounded-4 shadow">
        <div class="modal-header p-5 pb-4 border-bottom-0">
        <h1 class="fw-bold mb-0 fs-2">Modification d'une tuile</h1>
        <button id="closeEditForm${card.id}" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-5 pt-0">
        <form id="edit_card_form_${card.id}">
            <div class="form-floating mb-3">
            <input id="edit_card_name_${card.id}" name="name" type="name" class="form-control rounded-3" placeholder="Nom d'album" value="${card.name}" required>
            <label for="edit_card_name_${card.id}">Nom d'album</label></div>
            <div class="form-floating mb-3">
            <input id="edit_card_artist_${card.id}" name="artist" type="artist" class="form-control rounded-3" placeholder="Artiste" value="${card.artist}" required>
            <label for="edit_card_artist_${card.id}">Artiste</label></div>
            <div class="form-floating mb-3">
            <select class="form-select" id="edit_card_category_${card.id}" required></select>
            <label for="edit_card_category_${card.id}">Genre musical</label></div>
            <div class="form-floating mb-3">
            <input id="edit_card_date_${card.id}" name="date" type="date" class="form-control rounded-3" placeholder="Date de sortie" value="${new Date(card.date).toISOString().slice(0, 10)}" required>
            <label for="edit_card_date_${card.id}">Date de sortie</label></div>
            <div class="form-floating mb-3">
            <input id="edit_card_url_${card.id}" name="url" type="url" class="form-control rounded-3" placeholder="Lien vers la couverture d'album" value="${card.url}" required>
            <label for="edit_card_url_${card.id}">Lien vers la couverture d'album</label></div>
            <div class="form-floating mb-3">
            <input id="edit_card_des_${card.id}" name="description" type="description" class="form-control rounded-3" placeholder="Description" value="${card.description}">
            <label for="edit_card_des_${card.id}">Description</label></div>
            <button id="edit_card_clear_${card.id}" class="w-100 mb-2 btn btn-lg rounded-3 btn-outline-success" type="reset">Réinitialiser</button>
            <button id="edit_card_btn_${card.id}" class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">Modifier</button></form>
        </div>
    </div>
    </div>       
    `;

    let options = all_categories.map(category => {
        if (category.id === card.category_id) {
            return `<option value="${category.id}" selected>${category.name}</option>`;
        } else {
            return `<option value="${category.id}">${category.name}</option>`;
        }
    }).join('\n');

    let selectElement = editCardForm.querySelector(`#edit_card_category_${card.id}`);
    selectElement.innerHTML += options;

    const deleteCardModal = document.createElement('div');
    deleteCardModal.className = 'modal fade p-5';
    deleteCardModal.id = `modalDeleteCard${card.id}`;
    deleteCardModal.tabindex = '-1';
    deleteCardModal.role = 'dialog';
    deleteCardModal.innerHTML = `
    <div class="modal-dialog">
    <div class="modal-content rounded-4 shadow">
        <div class="modal-header border-bottom-0">
        <h1 class="fw-bold mb-0 fs-2">Suppression d'une tuile</h1>
        <button id="closeDeleteModal${card.id}" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body py-0">
        <p>Êtes-vous sûr de vouloir supprimer la tuile</p>
        <p>${card.name} - ${card.artist} ?</p>
        </div>
        <div class="modal-footer flex-column align-items-stretch w-100 gap-2 pb-3 border-top-0">
        <button id="delete_card_${card.id}" type="submit" class="btn btn-lg btn-danger">Confirmer</button>
        <button type="button" class="btn btn-lg btn-secondary" data-bs-dismiss="modal">Annuler</button></div>
    </div>
    </div>
    `;

    document.getElementById('secondaryForm').appendChild(editCardForm);
    document.getElementById('secondaryForm').appendChild(deleteCardModal);
    document.getElementById('card-contents').appendChild(cardElement);

    const editForm = document.getElementById(`edit_card_form_${card.id}`);

    editForm.addEventListener('submit', async function (event) {
        event.preventDefault();


        const formData = new FormData(editForm);
        const tileData = {
            id: card.id,
            name: formData.get('name'),
            artist: formData.get('artist'),
            category_id: document.getElementById(`edit_card_category_${card.id}`).value,
            user_id: active_user.id,
            date: formData.get('date'),
            description: formData.get('description'),
            url: formData.get('url')
        };
        console.log("----------------------------------------------------------------------------------");
        console.log(tileData);
        console.log("----------------------------------------------------------------------------------");

        alert("edit btn work");
        /*
        const response = await fetch('/api/cardstest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tileData)
        });

        if (response.ok) {
            alert('Tile added successfully');
            addTileForm.reset();
            fetchTiles();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addTileModal'));
            modal.hide();
        } else {
            alert('super sad !Error adding tile');
        }*/

        document.getElementById(`closeEditForm${card.id}`).click();
        document.getElementById("resetButton").click();
    });

    const deleteCard = document.getElementById(`delete_card_${card.id}`);

    deleteCard.addEventListener('click', async function (event) {

        alert("delete btn work");

        const deleteData = {
            id: card.id
        };
        console.log("----------------------------------------------------------------------------------");
        console.log(deleteData);
        console.log("----------------------------------------------------------------------------------");
        /*
        const response = await fetch('/api/cardstest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tileData)
        });

        if (response.ok) {
            alert('Tile added successfully');
            addTileForm.reset();
            fetchTiles();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addTileModal'));
            modal.hide();
        } else {
            alert('super sad !Error adding tile');
        }*/

        document.getElementById(`closeDeleteModal${card.id}`).click();
        document.getElementById("resetButton").click();

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

async function allCategories() {
    try {
        const response = await fetch('/cate/all_categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const categories = await response.json();
            return categories
        }
    } catch (err) {
        console.error(err);
    }
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



async function addElement() {
    const active_user = await getActiveUser(localStorage.getItem('token'));
    const cardElement = document.createElement('div');
    cardElement.className = 'col-sm-6 col-lg-4 mb-4 rounded';
    cardElement.innerHTML = `
    <div class="card">
    <div class="btn btn-sm btn-outline-secondary">
        <a id="add" data-bs-toggle="modal" data-bs-target="#modalAddCard" href="#" class="stretched-link card-text" aria-label="Add" style="text-decoration: none; color: inherit; font-size: 2rem;">+
        <span class="visually-hidden">Add</span></a>
    </div>
    </div>
    `;

    const all_categories = await allCategories();
    const addCardForm = document.createElement('div');
    addCardForm.className = 'modal fade p-5';
    addCardForm.id = 'modalAddCard';
    addCardForm.role = 'dialog';
    addCardForm.tabindex = '-1';
    addCardForm.innerHTML = `
    <div class="modal-dialog" role="document">
    <div class="modal-content rounded-4 shadow">
        <div class="modal-header p-5 pb-4 border-bottom-0">
        <h1 class="fw-bold mb-0 fs-2">Ajout d'une tuile</h1>
        <button id="closeAddForm" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-5 pt-0">
        <form id="add_card_form">
            <div class="form-floating mb-3">
            <input id="add_card_name" name="name" type="name" class="form-control rounded-3" placeholder="Nom d'album" required>
            <label for="add_card_name">Nom d'album</label></div>
            <div class="form-floating mb-3">
            <input id="add_card_artist" name="artist" type="artist" class="form-control rounded-3" placeholder="Artiste" required>
            <label for="add_card_artist">Artiste</label></div>
            <div class="form-floating mb-3">
            <select class="form-select" id="add_card_category" required>
                <option selected disabled value="">Choisir...</option></select>
            <label for="add_card_category">Genre musical</label></div>
            <div class="form-floating mb-3">
            <input id="add_card_date" name="date" type="date" class="form-control rounded-3" placeholder="Date de sortie" required>
            <label for="add_card_date">Date de sortie</label></div>
            <div class="form-floating mb-3">
            <input id="add_card_url" name="url" type="url" class="form-control rounded-3" placeholder="Lien vers la couverture d'album" required>
            <label for="add_card_url">Lien vers la couverture d'album</label></div>
            <div class="form-floating mb-3">
            <input id="add_card_des" name="description" type="description" class="form-control rounded-3" placeholder="Description">
            <label for="add_card_des">Description</label></div>
            <button id="add_card_clear" class="w-100 mb-2 btn btn-lg rounded-3 btn-outline-danger" type="reset">Effacer</button>
            <button id="add_card_btn" class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">Ajouter</button></form>
        </div>
    </div>
    </div>
    `;

    let options = all_categories.map(category => `<option value="${category.id}">${category.name}</option>`).join('\n');
    let selectElement = addCardForm.querySelector('#add_card_category');
    selectElement.innerHTML += options;

    document.getElementById('secondaryForm').appendChild(addCardForm);
    document.getElementById('card-contents').appendChild(cardElement);
    document.getElementById('add_card_form').addEventListener('submit', async function (event) {
        event.preventDefault();
        alert("submit btn work");

        const formData = new FormData(add_card_form);
        const tileData = {
            name: formData.get('name'),
            artist: formData.get('artist'),
            category_id: document.getElementById('add_card_category').value,
            user_id: active_user.id,
            date: formData.get('date'),
            description: formData.get('description'),//? formData.get('description') : ""
            url: formData.get('url')
        };
        console.log("----------------------------------------------------------------------------------");
        console.log(tileData);
        console.log("----------------------------------------------------------------------------------");
        /*
        const response = await fetch('/api/cardstest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tileData)
        });

        if (response.ok) {
            alert('Tile added successfully');
            addTileForm.reset();
            fetchTiles();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addTileModal'));
            modal.hide();
        } else {
            alert('super sad !Error adding tile');
        }*/
        document.getElementById("closeAddForm").click();
        document.getElementById("resetButton").click();
    });
}

async function useMasonry() {
    var msnry = new Masonry(document.getElementById('card-contents'), {
        percentPosition: true
    });
}

async function clearCards() {
    const cardContainer = document.getElementById('card-contents');
    while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild);
    }
    const formContainer = document.getElementById('secondaryForm');
    while (formContainer.firstChild) {
        formContainer.removeChild(formContainer.firstChild);
    }
}

async function clearPagis() {
    const pagination = document.querySelector('.pagination');
    while (pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }
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
        return;
    }
}

async function loadBar() {
    const token = localStorage.getItem('token');
    const activeUser = await getActiveUser(token);
    document.getElementById("welcomeBar").innerHTML = `
    <h1>Bonjour, ${activeUser.username}</h1>
    <p class="lead">Bienvenue dans le monde des albums de musique !</p>
    <p class="lead">Utilisez la barre de recherche pour trouver plus rapidement la tuile que vous recherchez ! </p>
    <p class="lead">Veuillez sélectionner une option valide dans les deux premières cases, puis entrez votre recherche dans la barre de recherche et cliquez sur Recherche.</p>
    <p class="lead">En cliquant sur Effacer, vous videriez la barre de recherche et toutes les tuiles seront affichées.</p>
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
          </li>
    `;
}

async function loadUserBar() {
    document.getElementById("top-navbar").innerHTML = `
          <li class="nav-item">
            <a class="nav-link" id="usersCards">Vos tuiles</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" id="userPageAllCards">Toutes les tuiles</a>
          </li>
    `;
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
                window.location.href = 'index.html';
                return;
            }
        } catch (err) {
            console.error('Failed to log out:', err);
            alert('An error occurred while logging out. Please try again later.');
            window.location.href = 'index.html';
            return;
        }
    });
}