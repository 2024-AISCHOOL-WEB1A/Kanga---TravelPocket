async function handleLogin(event) {
    event.preventDefault(); // 폼 제출 방지

    const userId = document.getElementById('login_user_id').value;
    const userPw = document.getElementById('login_user_pw').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId, user_pw: userPw })
        });

        const data = await response.json(); // JSON 형식으로 응답 받음

        if (!response.ok) {
            console.error('로그인 중 오류:', data.message);
            alert('로그인 중 오류 발생: ' + data.message);
            return;
        }

        console.log('로그인 성공:', data.message);
        alert('로그인 성공');
        // 로그인 성공 후 리다이렉트 등 처리
        window.location.href = 'index.html';
    } catch (error) {
        console.error('로그인 중 오류:', error.message);
        alert('서버와의 연결 중 오류 발생');
    }
}