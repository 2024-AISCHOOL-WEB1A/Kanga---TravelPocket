const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai'); // OpenAI 패키지에서 OpenAI 클래스를 사용합니다
const pool = require('./config/db.js'); // 데이터베이스 연결 모듈
const fs = require('fs');
const session = require('express-session');
const react = require('react')
const axios = require('axios');
const { spawn } = require('child_process');
const fetch = require('node-fetch');

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
app.use(express.static('../Kanga---TravelPocket/userinfo'));
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

// 유저가 입력한 정보 전달용
app.post('/save-country', async (req, res) => {
    const { country_name, start_date, end_date,
        companion_kid_YN, companion_teenager_YN,
        companion_adult_YN, companion_pet_YN, companion_disabled_YN } = req.body;
    const user_id = req.session.user_id; // 현재 로그인 중인 사용자 ID 가져오기

    if (!user_id) {
        return res.status(401).send('로그인이 필요합니다');
    }

    const query = `
        INSERT INTO tb_travel_info (user_id, country_name, start_date, end_date,
            companion_kid_YN, companion_teenager_YN,
            companion_adult_YN, companion_pet_YN, companion_disabled_YN)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        const [results] = await pool.query(query, [user_id, country_name, start_date, end_date,
            companion_kid_YN, companion_teenager_YN,
            companion_adult_YN, companion_pet_YN, companion_disabled_YN]);
        res.status(200).json({ message: '국가 정보 전달 성공', results });
    } catch (error) {
        console.error('데이터 삽입에 오류 발생 :', error.stack);
        res.status(500).send('데이터베이스에 저장 실패');
    }
});

app.post('/travel-info', (req, res) => {
    travelData = req.body;
    console.log('Received travel data:', travelData);
    res.json({ success: true });
});
// 사용자 정보 조회
app.get('/user-info', (req, res) => {
    const user_id = req.session.user_id;
    if (!user_id) {
        return res.status(401).json({ message: '로그인이 필요합니다' });
    }
    res.status(200).json({ user_id });
});

// 문서 조회
app.get('/document-info', (req, res) => {
    // const countryIdx = parseInt(req.query.country_idx);
    // const result = documents.filter(doc => doc.country_idx === countryIdx);
    // res.json(result);

    docData = req.body;
    console.log('Received travel data:', docData);
    res.json({ success: true });
  });
  


// 국가 데이터 가져와서 컨트리 이름에 따른 인덱스 추가
app.get('/countries', async (req, res) => {
    const query = 'SELECT country_idx, country_name FROM tb_country';
    try {
        const [results] = await pool.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error('데이터 조회에 오류 발생:', error.stack);
        res.status(500).send('데이터베이스 조회 실패');
    }
});


// Endpoint to handle user input
app.post('/chatbot', async (req, res) => {
    const userInput = req.body.userInput;
    const systemMessage = req.body.systemMessage;

    try {
        // EEVE 서버에 요청을 보내기 위한 데이터 준비
        const messages = [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userInput }
        ];

        const response = await axios.post('http://localhost:11434/v1/chat/completions', {
            model: 'ModelFile',
            messages: messages
        }, {
            headers: { 'Authorization': 'Bearer EEVE-Korean-Instruct-10.8B' }
        });

        // EEVE 서버의 응답을 클라이언트에 전달
        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error communicating with EEVE server');
    }
});



app.post('/query', async (req, res) => {
    const userQuery = req.body.query;

    try {
        const response = await fetch('http://127.0.0.1:5000/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: userQuery })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error: ${response.status} ${response.statusText}`);
            console.error(`Response: ${errorText}`);
            return res.status(response.status).json({ error: 'An error occurred while processing your request.' });
        }

        const data = await response.json();
        res.json({ result: data.result });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});




app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
