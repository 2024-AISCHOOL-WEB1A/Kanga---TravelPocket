const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai'); // OpenAI 패키지에서 OpenAI 클래스를 사용합니다
const pool = require('./config/db.js'); // 데이터베이스 연결 모듈
const fs = require('fs');
const session = require('express-session');

require('dotenv').config(); // 오픈 API 키 가져오는 코드 삭제 금지

const app = express();
const port = 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use(express.static('../Kanga---TravelPocket'));
app.use(express.static('../Kanga---TravelPocket/main'));
app.use(express.static('../Kanga---TravelPocket/accounts'));
app.use(express.static('../Kanga---TravelPocket/checklist'));
app.use(express.static('../Kanga---TravelPocket/static'));
app.use(express.static('../Kanga---TravelPocket/intro'));
app.use(express.static('../Kanga---TravelPocket/frontend'));
app.use(express.static('../Kanga---TravelPocket/backend'));
app.use(express.static('../Kanga---TravelPocket/newsletter'));
app.use(express.static('../Kanga---TravelPocket/chatbot'));

// 세션 미들웨어 설정
app.use(session({
    secret: process.env.SESSION_SECRET, // 비밀 키 설정
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // HTTPS를 사용하는 경우 true로 설정
}));

const mainRouter = require('./routes/mainRouter.js');
const userRouter = require('./routes/userRouter');
app.use('/', mainRouter);
app.use('/', userRouter);

app.post('/save-country', (req, res) => {
    const { country_idx, country_name } = req.body;
    const query = 'INSERT INTO tb_travel_country (country_idx, country_name) VALUES (?, ?)';
    pool.query(query, [country_idx, country_name], (error, results) => {
        if (error) {
            console.error('데이터 삽입에 오류 발생 :', error.stack);
            res.status(500).send('데이터베이스에 저장 실패');
            return;
        }
        res.status(200).json({ message: '국가 정보 전달 성공' });
    });
});

app.post('/query', async (req, res) => {
    const queryText = req.body.query;
    if (!queryText) {
        return res.status(400).json({ result: '잘못된 요청입니다. query 파라미터를 확인해주세요.' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: queryText }],
        });
        res.json({ result: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ result: '서버에서 오류가 발생했습니다.' });
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
