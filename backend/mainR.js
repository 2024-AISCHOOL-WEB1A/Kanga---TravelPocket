const express = require('express');
const router = express.Router();

// 메인 페이지 라우터
router.get('/', (req, res) => {
    res.send('메인 페이지입니다.');
});

// 기타 라우터 추가

module.exports = router;
