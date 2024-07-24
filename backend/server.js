const express = require('express');
const path = require('path');
const cors = require('cors');
const schedule = require('node-schedule');
const crypto = require('crypto');
const pool = require('../config/db'); // 데이터베이스 연결 모듈
const crawlData = require('./crawling'); // 크롤링 모듈
const insertData = require('./insert'); // 데이터 삽입 모듈

const app = express();
const port = 3000;

const mainRouter = require('./mainR');
const userRouter = require('./userRouter');

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, '../Kanga---TravelPocket')));

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

// 사용자 관련 라우터 설정
app.use('/user', userRouter);

// 메인 라우터 설정
app.use('/', mainRouter);

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
