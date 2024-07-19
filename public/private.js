document.addEventListener('DOMContentLoaded', async (event) => {
    /*var backtologin = document.getElementById("backtologin");

    backtologin.addEventListener('click', function () {
        window.location.href = "index.html";
    });*/

    var colors = ['bg-primary text-white','bg-success text-white', 'bg-danger text-white', 'bg-warning text-dark', 'bg-info text-dark', 'bg-light text-dark', 'bg-dark text-white'];

    var cards = document.querySelectorAll('.card-body');

    cards.forEach(function(card) {
        var color = colors[Math.floor(Math.random() * colors.length)];
        var classes = color.split(' ');

        card.classList.add(...classes);
    });

    var addElement = document.getElementById("add");

    // Add the new code here
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const response = await fetch('/user_page', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    
    if (response.ok) {
        const data = await response.json();
        if (data.message === 'OK') {
            // Load the page content as needed
        } else {
            alert('Failed to load page');
            window.location.href = 'index.html';
        }
    } else {
        alert('Failed to load page');
        window.location.href = 'index.html';
    }
});
