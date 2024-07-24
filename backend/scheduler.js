const schedule = require('node-schedule');
const crawlData = require('./crawling'); // 크롤링 모듈
const insertData = require('./insert');   // 데이터 삽입 모듈

// 6시간마다 작업 실행 (0분에 실행)
schedule.scheduleJob('0 */6 * * *', async () => {
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
