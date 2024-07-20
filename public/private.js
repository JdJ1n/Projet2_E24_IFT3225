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
        if (response.ok) {console.log("Page start to load.");
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

    console.log("Page loading...")


    var colors = ['bg-primary text-white','bg-success text-white', 'bg-danger text-white', 'bg-warning text-dark', 'bg-info text-dark', 'bg-light text-dark', 'bg-dark text-white'];

            var cards = document.querySelectorAll('.card-body');

            cards.forEach(function(card) {
                var color = colors[Math.floor(Math.random() * colors.length)];
                var classes = color.split(' ');

                card.classList.add(...classes);
            });

            var addElement = document.getElementById("add");

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

    console.log("Page loaded!")
});
