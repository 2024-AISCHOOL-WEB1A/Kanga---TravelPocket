const db = require('../config/db');

async function insertCSVData(results) {
    const connection = await db.getConnection();
    try {
        for (const result of results) {
            const { Country, Title, Date, url } = result;

            try {
                // 국가 식별자 가져오기
                const [countryResult] = await connection.query(
                    'SELECT country_idx FROM tb_country WHERE country_name = ?',
                    [Country]
                );

                if (countryResult.length > 0) {
                    const countryIdx = countryResult[0].country_idx;

                    // 데이터베이스에 삽입
                    await connection.query(
                        'INSERT INTO tb_safety (country_idx, safety_title, safety_url, created_at) VALUES (?, ?, ?, ?)',
                        [countryIdx, Title, url, Date]
                    );
                } else {
                    console.error(`국가 식별자를 찾을 수 없음: ${Country}`);
                }
            } catch (error) {
                console.error(`삽입 실패: ${Title} - ${error.message}`);
            }
        }
    } catch (error) {
        console.error(`데이터베이스 작업 중 오류: ${error.message}`);
    } finally {
        connection.release();
    }
}

module.exports = insertCSVData;
