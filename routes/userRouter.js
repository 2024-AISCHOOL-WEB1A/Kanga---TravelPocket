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
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: '로그아웃 중 오류 발생' });
        }
        res.clearCookie('connect.sid'); // 세션 쿠키 무효화
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
            SELECT country_idx, start_date, end_date,  
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
// 유저의 여행 정보와 문서 정보 가져오기
router.get('/document-info', async (req, res) => {
    // 세션에서 유저 정보 확인
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: '로그인이 필요합니다' });
    }

    // 세션에서 유저 ID 가져오기
    const userId = req.session.user.id;

    try {
        // 여행 정보와 문서 정보를 조인하여 조회
        const sql = `
            SELECT 
                t.country_idx, 
                t.start_date, 
                t.end_date,  
                t.companion_kid_YN, 
                t.companion_teenager_YN, 
                t.companion_adult_YN, 
                t.companion_pet_YN, 
                t.companion_disabled_YN,
                d.doc_name, 
                d.doc_detail
            FROM 
                Insa5_JSA_hacksim_1.tb_travel_info t
            LEFT JOIN 
                Insa5_JSA_hacksim_1.tb_document d 
            ON 
                t.country_idx = d.country_idx
            WHERE 
                t.user_id = ?
        `;
        const [results] = await pool.query(sql, [userId]);

        // 조회된 결과가 없을 경우
        if (results.length === 0) {
            return res.status(404).json({ message: '여행 정보를 찾을 수 없습니다' });
        }

        // 결과를 country_idx에 따라 그룹화
        const groupedResults = results.reduce((acc, row) => {
            const key = row.country_idx;
            if (!acc[key]) {
                acc[key] = {
                    country_idx: row.country_idx,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    companion_kid_YN: row.companion_kid_YN,
                    companion_teenager_YN: row.companion_teenager_YN,
                    companion_adult_YN: row.companion_adult_YN,
                    companion_pet_YN: row.companion_pet_YN,
                    companion_disabled_YN: row.companion_disabled_YN,
                    documents: []
                };
            }
            if (row.doc_name) {
                acc[key].documents.push({
                    doc_name: row.doc_name,
                    doc_detail: row.doc_detail
                });
            }
            return acc;
        }, {});

        // 결과 배열로 변환
        const finalResults = Object.values(groupedResults);

        // 조회된 여행 정보와 문서 정보 반환
        res.status(200).json(finalResults);
    } catch (err) {
        console.error('여행 정보 및 문서 정보 조회 중 오류 발생:', err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});


// 여행 정보 저장
router.post('/travel-info', async (req, res) => {
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: '로그인이 필요합니다' });
    }

    const { country_idx, start_date, end_date, companion_kid_YN, companion_teenager_YN, companion_adult_YN, companion_pet_YN, companion_disabled_YN } = req.body;
    const userId = req.session.user.id;

    try {
        // 사용자의 기존 여행 정보가 있는지 확인
        const checkSql = 'SELECT * FROM tb_travel_info WHERE user_id = ?';
        const [checkResults] = await pool.query(checkSql, [userId]);

        if (checkResults.length > 0) {
            // 기존 정보가 있는 경우 업데이트
            const updateSql = `
                UPDATE tb_travel_info
                SET country_idx = ?, start_date = ?, end_date = ?, companion_kid_YN = ?, companion_teenager_YN = ?, companion_adult_YN = ?, companion_pet_YN = ?, companion_disabled_YN = ?
                WHERE user_id = ?
            `;
            await pool.query(updateSql, [country_idx, start_date, end_date, companion_kid_YN, companion_teenager_YN, companion_adult_YN, companion_pet_YN, companion_disabled_YN, userId]);
            res.status(200).json({ message: '여행 정보가 업데이트되었습니다.' });
        } else {
            // 기존 정보가 없는 경우 새로 삽입
            const insertSql = `
                INSERT INTO tb_travel_info (user_id, country_idx, start_date, end_date, companion_kid_YN, companion_teenager_YN, companion_adult_YN, companion_pet_YN, companion_disabled_YN) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            await pool.query(insertSql, [userId, country_idx, start_date, end_date, companion_kid_YN, companion_teenager_YN, companion_adult_YN, companion_pet_YN, companion_disabled_YN]);
            res.status(201).json({ message: '여행 정보가 저장되었습니다.' });
        }
    } catch (err) {
        console.error('여행 정보 저장 중 오류 발생:', err.message); // 오류 메시지 로그
        res.status(500).json({ message: '서버 오류' });
    }
});



// To-Do 항목 추가
router.post('/add-todo-item', async (req, res) => {
    const { item } = req.body;
    const userId = req.session.user.id;
  
    if (!item || !userId) {
      return res.status(400).json({ message: '항목과 사용자 ID는 필수입니다.' });
    }
  
    try {
      const sql = `INSERT INTO tb_todo_items (user_id, item_text) VALUES (?, ?)`;
      await pool.query(sql, [userId, item]);
      res.status(200).json({ message: '항목이 성공적으로 추가되었습니다.' });
    } catch (err) {
      console.error('To-Do 항목 추가 중 오류 발생:', err.message);
      res.status(500).json({ message: '서버 오류' });
    }
  });
  
  // To-Do 항목 가져오기
  router.get('/get-todo-items', async (req, res) => {
    const userId = req.session.user.id;
  
    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }
  
    try {
      const sql = `SELECT item_text FROM tb_todo_items WHERE user_id = ?`;
      const [results] = await pool.query(sql, [userId]);
      res.status(200).json(results.map(row => ({ text: row.item_text })));
    } catch (err) {
      console.error('To-Do 항목 조회 중 오류 발생:', err.message);
      res.status(500).json({ message: '서버 오류' });
    }
  });

  router.delete('/delete-todo-item/:itemText', async (req, res) => {
    // URL 파라미터에서 itemText 추출 및 디코딩
    const itemText = decodeURIComponent(req.params.itemText);
    const userId = req.session.user.id;

    if (!itemText || !userId) {
        return res.status(400).json({ message: '항목과 사용자 ID는 필수입니다.' });
    }

    try {
        // SQL 쿼리에서 안전하게 항목 삭제
        const sql = `DELETE FROM tb_todo_items WHERE user_id = ? AND item_text = ?`;
        const [result] = await pool.query(sql, [userId, itemText]);

        // 삭제된 항목 수를 확인하여 성공 여부 판별
        if (result.affectedRows > 0) {
            res.status(200).json({ message: '항목이 성공적으로 삭제되었습니다.' });
        } else {
            res.status(404).json({ message: '항목을 찾을 수 없습니다.' });
        }
    } catch (err) {
        console.error('To-Do 항목 삭제 중 오류 발생:', err.message);
        res.status(500).json({ message: '서버 오류' });
    }
});
// ---------------------------------------------------------------- test -----------------------------------------------------------------------------


module.exports = router;
