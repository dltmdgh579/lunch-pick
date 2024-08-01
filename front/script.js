document.addEventListener('DOMContentLoaded', function() {
    const serverUrl = 'https://<your-heroku-app-name>.herokuapp.com';  // Heroku 서버 URL
    const menuInput = document.getElementById('menuInput');
    const addMenuButton = document.getElementById('addMenuButton');
    const recommendButton = document.getElementById('recommendButton');
    const menuDisplay = document.getElementById('menuDisplay');
    const menuList = document.getElementById('menuList');

    addMenuButton.addEventListener('click', function() {
        const newMenu = menuInput.value.trim();
        if (newMenu !== '') {
            fetch(`${serverUrl}/menus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ menu: newMenu })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Menu added successfully') {
                    menuInput.value = '';
                    menuInput.focus();
                    loadMenus();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    recommendButton.addEventListener('click', function() {
        fetch(`${serverUrl}/menus`)
            .then(response => response.json())
            .then(menus => {
                if (menus.length === 0) {
                    menuDisplay.textContent = 'Please add some menus first!';
                } else {
                    const randomIndex = Math.floor(Math.random() * menus.length);
                    const selectedMenu = menus[randomIndex];
                    menuDisplay.textContent = `오늘은 "${selectedMenu}" 어떠신가요?`;
                }
            })
            .catch(error => console.error('Error:', error));
    });

    function loadMenus() {
        fetch(`${serverUrl}/menus`)
            .then(response => response.json())
            .then(menus => {
                menuList.innerHTML = '';
                menus.forEach(menu => {
                    const li = document.createElement('li');
                    li.textContent = menu;
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', function() {
                        fetch(`${serverUrl}/menus`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ menu })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message === 'Menu deleted successfully') {
                                loadMenus();
                            } else {
                                alert(data.message);
                            }
                        })
                        .catch(error => console.error('Error:', error));
                    });
                    li.appendChild(deleteButton);
                    menuList.appendChild(li);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // 페이지 로드 시 메뉴 목록 가져오기
    loadMenus();
});
