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
            Swal.fire({
                title: '로그인 오류',
                text: `로그인 중 오류 발생: ${data.message}`,
                icon: 'error',
                customClass: {
                    confirmButton: 'custom-confirm-button'
                }
            });
            return;
        }

        console.log('로그인 성공:', data.message);
        Swal.fire({
            title: '로그인 성공',
            text: '로그인에 성공했습니다.',
            icon: 'success',
            customClass: {
                confirmButton: 'custom-confirm-button'
            }
        }).then(()=>{
            // 로그인 성공 후 리다이렉트 등 처리
            window.location.href = '/main';
        });
        
        
    } catch (error) {
        console.error('로그인 중 오류:', error.message);
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

