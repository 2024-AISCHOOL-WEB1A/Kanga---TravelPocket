const schedule = require('node-schedule');
const crawlData = require('./crawling'); // 크롤링 모듈
const insertData = require('./insert'); // 데이터 삽입 모듈

// 크롤링 및 데이터 삽입 함수 정의
async function executeTasks() {
    console.log('크롤링 작업 시작');
    try {
        await crawlData();
        console.log('크롤링 완료');
        await insertData();
        console.log('데이터베이스 삽입 완료');
    } catch (error) {
        console.error(`작업 중 오류 발생: ${error.message}`);
    }
}

// 즉시 한 번 실행
executeTasks();

// 주기적으로 크롤링하고 데이터베이스에 삽입하는 작업 예약
schedule.scheduleJob('0 0 * * *', executeTasks);
