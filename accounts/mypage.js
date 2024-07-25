async function updateUser() {
    const user_id = document.getElementById('user_id').value;
    const user_pw = document.getElementById('user_pw').value;
    const new_nick = document.getElementById('new_nick').value;
    const new_email = document.getElementById('new_email').value;

    try {
        const response = await fetch('/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id, user_pw, new_nick, new_email }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || '유저 정보 수정 성공');
        } else {
            alert('유저 정보 수정 중 오류: ' + (result.message || result));
        }
    } catch (error) {
        console.error('유저 정보 수정 중 오류:', error);
        alert('유저 정보 수정 중 오류: ' + error.message);
    }
}

async function deleteUser() {
    const user_id = document.getElementById('user_id').value;
    const user_pw = document.getElementById('user_pw').value;

    try {
        const response = await fetch('/user/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id, user_pw }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || '회원 탈퇴 성공');
        } else {
            alert('회원 탈퇴 중 오류: ' + (result.message || result));
        }
    } catch (error) {
        console.error('회원 탈퇴 중 오류:', error);
        alert('회원 탈퇴 중 오류: ' + error.message);
    }
}