const express = require('express');
const path = require('path');
const cors = require('cors');
const schedule = require('node-schedule');
const crypto = require('crypto');
const pool = require('../config/db'); // 데이터베이스 연결 모듈
const crawlData = require('./crawling'); // 크롤링 모듈
const insertData = require('./insert'); // 데이터 삽입 모듈
const bodyParser = require('body-parser');


const app = express();
const port = 3000;

const mainRouter = require('./mainRouter');
const userRouter = require('./userRouter');
const updateUserRouter = require('./updateUser');
const deleteUserRouter = require('./deleteUser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

// 사용자 관련 라우터 설정
app.use('/user', userRouter);
app.use('/user/update', updateUserRouter);
app.use('/user/delete', deleteUserRouter);


app.use('/', mainRouter);

app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
