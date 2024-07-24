const express = require('express');
const crypto = require('crypto');
const pool = require('../config/db');

const router = express.Router();

// SHA2 해시 함수
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// 사용자 정보 수정
router.post('/', async (req, res) => {
    const { user_id, user_pw, new_nick, new_email } = req.body;
    const hashedPassword = hashPassword(user_pw);

    try {
        const checkUserSql = 'SELECT * FROM tb_user WHERE user_id = ? AND user_pw = ?';
        const [results] = await pool.query(checkUserSql, [user_id, hashedPassword]);

        if (results.length === 0) {
            return res.status(404).json({ message: '사용자 ID 또는 비밀번호가 잘못되었습니다' });
        }

        const updateUserSql = 'UPDATE tb_user SET user_nick = ?, user_email = ? WHERE user_id = ?';
        await pool.query(updateUserSql, [new_nick, new_email, user_id]);
        res.status(200).json({ message: '유저 정보 수정 성공' });
    } catch (err) {
        console.error('유저 정보 수정 중 오류:', err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

module.exports = router;
