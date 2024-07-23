const schedule = require('node-schedule');
const crawlData = require('./crawling');
const insertData = require('./insert');
// backend/server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');  // db.js의 경로가 config 폴더에 있음
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));  // 프론트 폴더 경로

//npm install node-schedule < 실행전에 설치

// 10분 간격으로 crawlData와 insertData 함수를 실행
schedule.scheduleJob('*/10 * * * *', async () => {
    console.log('크롤링 작업을 시작합니다.');
    try {
        await crawlData();
        console.log('크롤링 작업이 완료되었습니다.');
    } catch (error) {
        console.error('크롤링 작업 중 오류 발생:', error);
    }

    console.log('데이터 삽입 작업을 시작합니다.');
    try {
        await insertData();
        console.log('데이터 삽입 작업이 완료되었습니다.');
    } catch (error) {
        console.error('데이터 삽입 작업 중 오류 발생:', error);
    }
});

// 회원가입
app.post('/register', async (req, res) => {
    const { user_id, user_pw, user_name, user_nick, user_birthdate, user_email, user_phone, passport_yn } = req.body;
    const hashedPassword = bcrypt.hashSync(user_pw, 8);

    try {
        const sql = 'INSERT INTO tb_user (user_id, user_pw, user_name, user_nick, user_birthdate, user_email, user_phone, joined_at, passport_yn) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)';
        await pool.query(sql, [user_id, hashedPassword, user_name, user_nick, user_birthdate, user_email, user_phone, passport_yn]);
        res.status(201).send('회원가입 성공');
    } catch (err) {
        res.status(500).send('서버 오류');
    }
});

// 로그인
app.post('/login', async (req, res) => {
    const { user_id, user_pw } = req.body;
    
    try {
        const sql = 'SELECT * FROM tb_user WHERE user_id = ?';
        const [results] = await pool.query(sql, [user_id]);

        if (results.length === 0) return res.status(404).send('사용자를 찾을 수 없습니다');

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(user_pw, user.user_pw);
        if (!passwordIsValid) return res.status(401).send('비밀번호가 잘못되었습니다');

        const token = jwt.sign({ id: user.user_id }, 'yourSecretKey', { expiresIn: '1h' });
        res.status(200).send({ auth: true, token, message: '로그인 성공' });
    } catch (err) {
        res.status(500).send('서버 오류');
    }
});

app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다`);
});