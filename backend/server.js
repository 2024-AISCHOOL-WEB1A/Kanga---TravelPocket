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

// 메인 라우터 설정
app.use('/', mainRouter);

app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});



//---------------------------------------------------------------------------------------------------

// app.use(express.static(file_path));
app.use(express.static('../Kanga---TravelPocket')); // 'public' 디렉토리에서 정적 파일을 제공하는 예
app.use(express.static('../Kanga---TravelPocket/main'));
app.use(express.static('../Kanga---TravelPocket/accounts'));
app.use(express.static('../Kanga---TravelPocket/checklist'));
app.use(express.static('../Kanga---TravelPocket/static'));
app.use(express.static('../Kanga---TravelPocket/intro'));
// app.use('/', express.static(file_path + '/'));

app.use('/', mainRouter)


// ----------------------------- user_county에서 입력받은 국가 이름 전달 -----------------------------


app.post('/save-country', (req, res) => {
    const { country_idx, country_name } = req.body;

    const query = 'INSERT INTO tb_travel_country (country_idx, country_name) VALUES (?)';
    pool.query(query, [country_idx, country_name], (error, results) => {
        if (error) {
            console.error('데이터 삽입에 오류 발생 :', error.stack);
            res.status(500).send('데이터베이스에 저장 실패');
            return;
        }
        res.status(200).json({ message: '국가 정보 전달 성공' });
    });
});
