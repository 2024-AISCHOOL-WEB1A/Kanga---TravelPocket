const express = require('express');
const crypto = require('crypto');
const pool = require('../config/db');

const router = express.Router();

// SHA2 해시 함수
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// 로그인 처리
router.post('/login', async (req, res) => {
    const { user_id, user_pw } = req.body;
    const hashedPassword = hashPassword(user_pw);

    try {
        const sql = 'SELECT * FROM tb_user WHERE user_id = ? AND user_pw = ?';
        const [results] = await pool.query(sql, [user_id, hashedPassword]);

        if (results.length === 0) {
            return res.status(401).json({ message: '잘못된 아이디 또는 비밀번호' });
        }

        res.status(200).json({ message: '로그인 성공' });
    } catch (err) {
        console.error('로그인 중 오류:', err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 사용자 등록
router.post('/register', async (req, res) => {
    const { user_id, user_pw, user_nick, user_email } = req.body;
    const hashedPassword = hashPassword(user_pw);

    try {
        const sql = 'INSERT INTO tb_user (user_id, user_pw, user_nick, user_email) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(sql, [user_id, hashedPassword, user_nick, user_email]);
        res.status(201).json({ message: '회원가입 성공' });
    } catch (err) {
        console.error('회원가입 중 오류:', err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 사용자 정보 수정
router.post('/update', async (req, res) => {
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

// 사용자 정보 삭제
router.post('/delete', async (req, res) => {
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
