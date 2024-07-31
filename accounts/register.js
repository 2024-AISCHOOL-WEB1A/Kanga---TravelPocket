
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

        const result = await response.json(); // JSON 형식으로 응답 받음

        if (!response.ok) {
            console.error('회원가입 중 오류:', result.message);
            Swal.fire({
                title: '회원가입 오류',
                text: `회원가입 중 오류 발생: ${result.message}`,
                icon: 'error',
                customClass: {
                    confirmButton: 'custom-confirm-button'
                }
            });
            return;
        }

        // 회원가입 성공
        Swal.fire({
            title: '회원가입 성공',
            text: '회원가입에 성공했습니다.',
            icon: 'success',
            customClass: {
                confirmButton: 'custom-confirm-button'
            }
        }).then(() => {
            window.location.href = '/main';
        });
        
    } catch (error) {
        console.error('회원가입 중 오류:', error.message);
        Swal.fire({
            title: '서버 오류',
            text: '서버와의 연결 중 오류 발생',
            icon: 'error',
            customClass: {
                confirmButton: 'custom-confirm-button'
            }
        });
    }
}
