
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: email, user_pw: password })  
    })
    .then(response => response.json())
    .then(data => {
        if (data.auth) {
            alert('로그인 성공');
            localStorage.setItem('token', data.token);
        } else {
            alert('로그인 실패');
        }
    })
    .catch(error => console.error('오류:', error));
});

