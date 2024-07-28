//Content Loaded
window.addEventListener("DOMContentLoaded", (e) => {
  var chatRoom = document.querySelector(".chat-room");
  var inputText = document.querySelector("#chatbotinput");
  var btnSend = document.querySelector(".button-send");
  var messageArea=document.querySelector(".message.message-right");

  // 메시지 전송 기능
  function sendMessage() {
      var mess = inputText.value;
      if (mess.trim() !== "") { // 빈 메시지는 보내지 않도록 체크
          var bubble = document.createElement('div');
          bubble.className += " bubble bubble-dark";
          bubble.textContent = mess;
          messageArea.appendChild(bubble);
          inputText.value = "";
      }
      chatRoom.scrollTop = chatRoom.scrollHeight;
  }
  
  btnSend.addEventListener('click', (e) => {
      sendMessage();
  });
  
  inputText.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          e.preventDefault(); // 기본 Enter 키의 동작(줄바꿈)을 막음
          
          sendMessage();
      }
  });

});