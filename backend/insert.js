const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('../config/db');  // db 모듈 경로 수정
const puppeteer = require('puppeteer');

// CSV 파일에서 데이터를 읽어오는 함수
function readCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ',', skipEmptyLines: true }))
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

// CSV 데이터베이스에 삽입
async function insertCSVData(results, urls) {
    const connection = await db;
    try {
        for (let i = 0; i < results.length; i++) {
            const { Country, Title, Date } = results[i];
            const url = urls[i].url;

            try {
                // 국가 식별자 조회
                const [countryResult] = await connection.query(
                    'SELECT country_idx FROM tb_country WHERE country_name = ?',
                    [Country]
                );

                console.log(`국가 조회 결과: ${JSON.stringify(countryResult)}`);

                if (countryResult.length > 0) {
                    const countryIdx = countryResult[0].country_idx;

                    // 데이터 삽입
                    const [insertResult] = await connection.query(
                        'INSERT INTO tb_safety (country_idx, safety_title, safety_content, safety_url, created_at) VALUES (?, ?, ?, ?, ?)',
                        [countryIdx, Title, '', url, Date]
                    );

                    console.log(`삽입 성공: ${Title}`);
                } else {
                    console.error(`국가 식별자를 찾을 수 없음: ${Country}`);
                }
            } catch (error) {
                console.error(`삽입 실패: ${Title} - ${error.message}`);
            }
        }
    } finally {
        // 연결 종료는 마지막에 한 번만 호출합니다.
        await connection.end();
    }
}

// URL의 내용을 스크래핑하여 데이터베이스를 업데이트하는 함수
async function updateContent() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const connection = await db;
    const [rows] = await connection.query('SELECT safety_idx, safety_url FROM tb_safety WHERE safety_content = ""');
    console.log(`업데이트 대상 행: ${JSON.stringify(rows)}`);

    for (const row of rows) {
        const { safety_idx, safety_url } = row;
        try {
            await page.goto(safety_url, { waitUntil: 'networkidle2' });
            const content = await page.evaluate(() => {
                const element = document.querySelector('.b_content b');
                return element ? element.innerText : '';
            });

            await connection.query(
                'UPDATE tb_safety SET safety_content = ? WHERE safety_idx = ?',
                [content, safety_idx]
            );

            console.log(`업데이트 성공: ${safety_url}`);
        } catch (error) {
            console.error(`업데이트 실패: ${safety_url} - ${error.message}`);
        }
    }

    await browser.close();
}

// 메인 실행 함수
(async () => {
    try {
        const results = await readCSVFile(path.join(__dirname, 'results.csv'));
        console.log(`CSV 파일 데이터`);

        const urls = await readCSVFile(path.join(__dirname, 'href_results.csv'));
        console.log(`URL CSV 파일 데이터`);

        await insertCSVData(results, urls);
        await updateContent();
    } catch (error) {
        console.error(`메인 함수 실행 중 오류: ${error.message}`);
    } finally {
        // 커넥션 풀 종료
        db.end();  // 모든 쿼리 완료 후 연결 종료
    }
})();
