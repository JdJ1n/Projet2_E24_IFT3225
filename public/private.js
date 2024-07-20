document.addEventListener('DOMContentLoaded', async (event) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        const response = await fetch('/user/user_page', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Load the page content as needed
        } else {
            const errorData = await response.json();
            alert('Failed to load page: ' + errorData.message);
            window.location.href = 'index.html';
        }
    } catch (err) {
        console.error('Failed to load page:', err);
        alert('An error occurred while loading the page. Please try again later.');
        window.location.href = 'index.html';
    }


    var colors = ['bg-primary text-white','bg-success text-white', 'bg-danger text-white', 'bg-warning text-dark', 'bg-info text-dark', 'bg-light text-dark', 'bg-dark text-white'];

    var cards = document.querySelectorAll('.card-body');

    cards.forEach(function(card) {
        var color = colors[Math.floor(Math.random() * colors.length)];
        var classes = color.split(' ');

        card.classList.add(...classes);
    });

    var addElement = document.getElementById("add");

    /*var backtologin = document.getElementById("backtologin");

    backtologin.addEventListener('click', function () {
        window.location.href = "index.html";
    });*/
    
});
