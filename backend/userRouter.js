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

        req.session.user = {
            id: user_id,
            nick: results[0].user_nick
        };

        res.status(200).json({ message: '로그인 성공' });
    } catch (err) {
        console.error('로그인 중 오류:', err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 세션 상태 확인
router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// 로그아웃 처리
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: '로그아웃 중 오류 발생' });
        }
        res.status(200).json({ message: '로그아웃 성공' });
    });
});

// 사용자 등록
router.post('/register', async (req, res) => {
    const { user_id, user_pw, user_nick, user_email } = req.body;
    const hashedPassword = hashPassword(user_pw);

    try {
        // 아이디 중복 체크
        const checkSql = 'SELECT * FROM tb_user WHERE user_id = ?';
        const [checkResult] = await pool.query(checkSql, [user_id]);

        if (checkResult.length > 0) {
            return res.status(409).json({ message: '이미 존재하는 ID입니다' });
        }

        // 아이디가 중복되지 않으면 회원 가입 진행
        const insertSql = 'INSERT INTO tb_user (user_id, user_pw, user_nick, user_email) VALUES (?, ?, ?, ?)';
        await pool.query(insertSql, [user_id, hashedPassword, user_nick, user_email]);

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

        // 세션 삭제
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: '세션 삭제 중 오류 발생' });
            }
            res.status(200).json({ message: '회원 탈퇴 성공' });
        });
    } catch (err) {
        console.error('회원 탈퇴 중 오류:', err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 유저의 여행 정보 가져오기
router.get('/travel-info', async (req, res) => {
    // 세션에서 유저 정보 확인
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: '로그인이 필요합니다' });
    }

    // 세션에서 유저 ID 가져오기
    const userId = req.session.user.id;

    try {
        // tb_travel_info 테이블에서 유저 ID에 해당하는 여행 정보 조회
        const sql = `
            SELECT start_date, end_date,  
                companion_kid_YN, companion_teenager_YN, companion_adult_YN, 
                companion_pet_YN, companion_disabled_YN 
            FROM tb_travel_info 
            WHERE user_id = ?
        `;
        const [results] = await pool.query(sql, [userId]);

        // 조회된 결과가 없을 경우
        if (results.length === 0) {
            return res.status(404).json({ message: '여행 정보를 찾을 수 없습니다' });
        }

        // 조회된 여행 정보 반환
        res.status(200).json(results);
    } catch (err) {
        console.error('여행 정보 조회 중 오류 발생:', err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});

module.exports = router;
