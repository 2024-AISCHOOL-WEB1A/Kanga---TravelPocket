const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('../config/db');

async function updateCSVWithCountryIdx(inputFilePath, outputFilePath) {
    const connection = await db.getConnection();
    const results = [];

    fs.createReadStream(inputFilePath)
        .pipe(csv({ separator: ',', skipEmptyLines: true }))
        .on('data', async (data) => {
            results.push(data);
        })
        .on('end', async () => {
            const updatedResults = [];
            
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

                        updatedResults.push({
                            safety_idx: 'NULL',
                            country_idx: countryIdx,
                            safety_title: Title,
                            safety_url: url,
                            created_at: Date
                        });
                    } else {
                        console.error(`국가 식별자를 찾을 수 없음: ${Country}`);
                    }
                } catch (error) {
                    console.error(`데이터 처리 실패: ${error.message}`);
                }
            }

            // 결과를 새로운 CSV 파일로 저장
            const csvWriter = require('csv-writer').createObjectCsvWriter({
                path: outputFilePath,
                header: [
                    { id: 'safety_idx', title: 'safety_idx' },
                    { id: 'country_idx', title: 'country_idx' },
                    { id: 'safety_title', title: 'safety_title' },
                    { id: 'safety_url', title: 'safety_url' },
                    { id: 'created_at', title: 'created_at' }
                ]
            });

            csvWriter.writeRecords(updatedResults)
                .then(() => console.log('CSV 파일이 업데이트되었습니다.'))
                .catch(error => console.error(`CSV 파일 업데이트 실패: ${error.message}`));
            
            connection.release();
        })
        .on('error', (error) => {
            console.error(`파일 읽기 중 오류: ${error.message}`);
            connection.release();
        });
}

updateCSVWithCountryIdx(path.join(__dirname, 'results.csv'), path.join(__dirname, 'updated_results.csv'));
