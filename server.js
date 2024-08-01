const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let menus = [];

// 메뉴 목록 가져오기
app.get('/menus', (req, res) => {
    res.json(menus);
});

// 메뉴 추가
app.post('/menus', (req, res) => {
    const newMenu = req.body.menu.trim();
    if (newMenu === '') {
        return res.status(400).json({ message: 'Invalid menu' });
    }

    // 중복 메뉴가 있는지 확인
    if (menus.includes(newMenu)) {
        return res.status(400).json({ message: 'Menu already exists' });
    }

    menus.push(newMenu);
    res.status(201).json({ message: 'Menu added successfully' });
});

// 메뉴 삭제
app.delete('/menus', (req, res) => {
    const menuToDelete = req.body.menu.trim();
    if (menuToDelete === '') {
        return res.status(400).json({ message: 'Invalid menu' });
    }

    // 메뉴가 존재하는지 확인 후 삭제
    if (!menus.includes(menuToDelete)) {
        return res.status(404).json({ message: 'Menu not found' });
    }

    menus = menus.filter(menu => menu !== menuToDelete);
    res.status(200).json({ message: 'Menu deleted successfully' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
