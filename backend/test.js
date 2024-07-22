conn.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) {
        console.error('쿼리 실행 오류:', error);
        return;
    }
    console.log('쿼리 실행 결과:', results[0].solution);
});
