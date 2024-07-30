const express = require('express');
const path = require('path');
const cors = require('cors');
const schedule = require('node-schedule');
const crypto = require('crypto');
const pool = require('../config/db');
const crawlData = require('./crawling');
const insertData = require('./insert');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3001;

const mainRouter = require('./mainR');
const userRouter = require('./userRouter');

// 세션 미들웨어 설정
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../backend')));

app.use(cors());

// 사용자 관련 라우터 설정
app.use('/user', userRouter);

// 정적 파일 제공 설정
// app.use(express.static(path.join(__dirname, '../Kanga---TravelPocket')));
app.use(express.static(path.join(__dirname, '../frontend')));
// my page css 불러오기 위해서는 밑의 코드 주석 풀어야 함!!
// app.use(express.static(path.join(__dirname, '../accounts')));

// 스케줄러 설정
const job = schedule.scheduleJob('0 0 * * *', async () => {
    console.log('크롤링 작업 시작');
    try {
        await crawlData();
        console.log('크롤링 완료');
        await insertData();
        console.log('데이터베이스 삽입 완료');
    } catch (error) {
        console.error(`작업 중 오류 발생: ${error.message}`);
    }
});
app.post('/user/travel-input', (req, res) => {
    travelData = req.body;
    console.log('Received travel data:', travelData);
    res.json({ success: true });
});

app.use('/', mainRouter);

app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
