async function handleRegister(event) {
    event.preventDefault();

    const userId = document.getElementById('register_user_id').value;
    const userPw = document.getElementById('register_user_pw').value;
    const userNick = document.getElementById('register_user_nick').value;
    const userEmail = document.getElementById('register_user_email').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId, user_pw: userPw, user_nick: userNick, user_email: userEmail }),
        });

        const result = await response.text();
        
        if (!response.ok) {
            console.error('회원가입 중 오류:', result);
            alert('회원가입 중 오류 발생: ' + result);
            return;
        }

        // 회원가입 성공
        alert('회원가입 성공');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('회원가입 중 오류:', error);
        alert('회원가입 중 오류 발생');
    }
}