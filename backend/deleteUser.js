const express = require('express');
const crypto = require('crypto');
const pool = require('../config/db');

const router = express.Router();

// SHA2 해시 함수
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// 사용자 정보 삭제
router.post('/', async (req, res) => {
    const { user_id, user_pw } = req.body;
    const hashedPassword = hashPassword(user_pw);

    try {
        const sql = 'DELETE FROM tb_user WHERE user_id = ? AND user_pw = ?';
        const [result] = await pool.query(sql, [user_id, hashedPassword]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '사용자 ID 또는 비밀번호가 잘못되었습니다' });
        }

        res.status(200).json({ message: '회원 탈퇴 성공' });
    } catch (err) {
        console.error('회원 탈퇴 중 오류:', err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

module.exports = router;
