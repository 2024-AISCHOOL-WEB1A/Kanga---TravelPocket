const schedule = require('node-schedule');
const crawlData = require('./crawling');
const insertData = require('./insert');

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
