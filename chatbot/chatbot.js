async function sendQuery() {
    const input = document.getElementById('chatbotinput').value;
    const chat = document.getElementById('chat');
    
    if (input.trim() === '') {
        alert('질문을 입력해주세요.');
        return;
    }

    // 사용자의 메시지를 채팅에 추가
    const userMessage = document.createElement('div');
    userMessage.className = 'message message-right';
    userMessage.innerHTML = `
        <div class="avatar-wrapper avatar-small">
            <img src="../templates/img/User_chat_img.png" alt="사용자 프로필 사진">
        </div>
        <div class="bubble bubble-dark">${input}</div>
    `;
    chat.appendChild(userMessage);

    // 입력 필드 초기화
    document.getElementById('chatbotinput').value = '';
    
    try {
        const response = await fetch('http://localhost:3000/query', { // 서버 포트와 경로 확인
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: input })
        });

        if (!response.ok) {
            throw new Error('서버 오류');
        }

        const result = await response.json();
        
        // 서버 응답을 채팅에 추가
        const botMessage = document.createElement('div');
        botMessage.className = 'message message-left';
        botMessage.innerHTML = `
            <div class="avatar-wrapper avatar-small">
                <img src="../templates/img/AI_chat_img.jpg" alt="챗봇 프로필 사진">
            </div>
            <div class="bubble bubble-light">${result.result || '서버에서 응답이 없습니다.'}</div>
        `;
        chat.appendChild(botMessage);
    } catch (error) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'message message-left';
        errorMessage.innerHTML = `
            <div class="avatar-wrapper avatar-small">
                <img src="../templates/img/AI_chat_img.jpg" alt="챗봇 프로필 사진">
            </div>
            <div class="bubble bubble-light">오류 발생: ${error.message}</div>
        `;
        chat.appendChild(errorMessage);
    }

    // 최신 메시지로 스크롤
    chat.scrollTop = chat.scrollHeight;
}
