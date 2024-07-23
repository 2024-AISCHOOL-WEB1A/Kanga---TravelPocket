const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');
const path = require('path');

// 데이터베이스 연결 설정
const pool = mysql.createPool({
    host: 'project-db-stu3.smhrd.com',
    port: 3307,
    database: 'Insa5_JSA_hacksim_1',
    user: 'Insa5_JSA_hacksim_1',
    password: 'aischool1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function insertData() {
    const connection = await pool.getConnection();
    try {
        const results = [];
        
        // CSV 파일을 읽어서 데이터 배열에 저장
        fs.createReadStream(path.join(__dirname, 'results.csv'))
            .pipe(csv({ separator: ',', skipEmptyLines: true }))
            .on('data', (row) => {
                // 데이터를 읽어오는 과정에서 NaN이나 잘못된 값을 처리합니다.
                const countryIdx = parseInt(row.country_idx, 10);
                const title = row.safety_title ? row.safety_title.replace(/'/g, "''") : '';
                const url = row.safety_url ? row.safety_url.replace(/'/g, "''") : '';
                const createdAt = row.created_at ? row.created_at.split('.').join('-') : '0000-00-00'; // 기본값 설정

                // 검증 및 기본값 처리
                if (isNaN(countryIdx)) {
                    console.error(`잘못된 country_idx 값: ${row.country_idx}`);
                    return; // 잘못된 데이터는 무시
                }

                results.push([countryIdx, title, url, createdAt]);
            })
            .on('end', async () => {
                // 쿼리문 생성
                const sql = `INSERT INTO tb_safety (country_idx, safety_title, safety_url, created_at) VALUES ?`;
                
                // 데이터베이스에 삽입
                try {
                    await connection.query(sql, [results]);
                    console.log('데이터가 tb_safety 테이블에 성공적으로 삽입되었습니다.');
                } catch (error) {
                    console.error(`데이터베이스 삽입 중 오류 발생: ${error.message}`);
                }
            });
    } catch (error) {
        console.error(`데이터 삽입 중 오류 발생: ${error.message}`);
    } finally {
        connection.release();
    }
}

insertData();
