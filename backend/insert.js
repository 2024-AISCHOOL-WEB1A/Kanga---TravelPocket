const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const pool = require('../config/db'); // db.js 파일에서 MySQL 연결 설정 가져오기

async function insertData() {
    const connection = await pool.getConnection();
    try {
        const results = [];
        
        // results.csv 파일의 절대 경로 설정
        const filePath = path.join(__dirname, 'results.csv');

        // CSV 파일을 읽어서 데이터 배열에 저장
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ',', skipEmptyLines: true }))
            .on('data', (row) => {
                const countryIdx = parseInt(row.country_idx, 10);
                const title = row.safety_title ? row.safety_title.replace(/'/g, "''") : '';
                const url = row.safety_url ? row.safety_url.replace(/'/g, "''") : '';
                const createdAt = row.created_at ? row.created_at.split('.').join('-') : '0000-00-00';

                if (!isNaN(countryIdx)) {
                    results.push([countryIdx, title, url, createdAt]);
                }
            })
            .on('end', async () => {
                const sql = `INSERT INTO tb_safety (country_idx, safety_title, safety_url, created_at) VALUES ?`;
                try {
                    await connection.query(sql, [results]);
                    console.log('데이터가 tb_safety 테이블에 성공적으로 삽입되었습니다.');
                } catch (error) {
                    console.error(`데이터베이스 삽입 중 오류 발생: ${error.message}`);
                } finally {
                    connection.release();
                }
            });
    } catch (error) {
        console.error(`데이터 삽입 중 오류 발생: ${error.message}`);
        connection.release();
    }
}

module.exports = insertData;
