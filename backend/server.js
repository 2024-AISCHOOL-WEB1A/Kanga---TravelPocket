const path = require('path');
const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');
const crypto = require('crypto'); // SHA2 해싱에 사용
const pool = require('../config/db'); // 데이터베이스 연결 모듈
const crawlData = require('./crawling'); // 크롤링 모듈
const insertData = require('./insert'); // 데이터 삽입 모듈





const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend'))); // 프론트엔드 폴더 경로
app.use(cors());

// 1000분 간격으로 crawlData와 insertData 함수를 실행
// schedule.scheduleJob('*/1000 * * * *', async () => {
//     console.log('크롤링 작업을 시작합니다.');
//     try {
//         await crawlData();
//         console.log('크롤링 작업이 완료되었습니다.');
//     } catch (error) {
//         console.error('크롤링 작업 중 오류 발생:', error);
//     }

//     console.log('데이터 삽입 작업을 시작합니다.');
//     try {
//         await insertData();
//         console.log('데이터 삽입 작업이 완료되었습니다.');
//     } catch (error) {
//         console.error('데이터 삽입 작업 중 오류 발생:', error);
//     }
// });

// SHA2 해시 함수
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// 회원가입
app.post('/register', async (req, res) => {
    const { user_id, user_pw, user_nick, user_email } = req.body;
    const hashedPassword = hashPassword(user_pw);

    try {
        const sql = 'INSERT INTO tb_user (user_id, user_pw, user_nick, user_email, joined_at) VALUES (?, ?, ?, ?, NOW())';
        await pool.query(sql, [user_id, hashedPassword, user_nick, user_email]);
        res.status(201).send('회원가입 성공');
    } catch (err) {
        console.error('회원가입 중 오류:', err.message);
        res.status(500).send('서버 오류');
    }
});
// 로그인
app.post('/login', async (req, res) => {
    const { user_id, user_pw } = req.body;
    const hashedPassword = hashPassword(user_pw);

    try {
        const sql = 'SELECT * FROM tb_user WHERE user_id = ? AND user_pw = ?';
        const [results] = await pool.query(sql, [user_id, hashedPassword]);

        if (results.length === 0) {
            return res.status(404).json({ message: '사용자 ID 또는 비밀번호가 잘못되었습니다' });
        }

        // 로그인 성공
        res.status(200).json({ message: '로그인 성공' });
    } catch (err) {
        console.error('로그인 중 오류:', err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다`);
});