async function fetchDocInfo() {
  try {
    // 서버에 여행 정보 조회 요청 보내기
    const response = await fetch('/document-info');
    const result = await response.json();

    if (response.ok) {
      // 서버로부터 받은 여행 정보를 콘솔에 출력
      console.log('여행 정보:', result);

      const packingList = document.getElementById('packingList');
      result.forEach(info => {
        console.log(`country_idx : ${info.country_idx}`);
        if (info.documents && info.documents.length > 0) {
          info.documents.forEach(doc => {
            console.log(`문서 이름 : ${doc.doc_name}`);
            console.log(`문서 세부 : ${doc.doc_detail}`);
            console.log('-------------------------'); // 구분선 추가

            // 문서 항목 추가
            const li = document.createElement('li');
            li.className = 'ch1';
            li.innerHTML = `
              <input type="checkbox" onclick="updateProgress('packingList', 'packingProgress')"> ${doc.doc_name}
              <button class="details-btn" onclick="toggleDetails(this)">+</button>
              <div class="details">${doc.doc_detail}</div>
            `;
            packingList.appendChild(li);
          });
        } else {
          console.log('문서 정보가 없습니다.');
        }

        // D-Day 계산 기능 추가
        if (info.start_date) {
          calculateDDay(info.start_date);
        }
      });

    } else {
      console.error('여행 정보 조회 실패:', result.message);
    }
  } catch (error) {
    console.error('여행 정보를 가져오는 중 오류 발생:', error);
  }
}

function toggleDetails(button) {
  const details = button.nextElementSibling;
  details.style.display = details.style.display === 'none' ? 'block' : 'none';
}

window.onload = fetchDocInfo;

// D-Day 계산 기능
function calculateDDay(targetDate) {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  document.getElementById('dday').innerText = `D-Day: ${diffDays} days left`;
}

// 세부사항 보기/숨기기 기능
function toggleDetails(button) {
  const details = button.nextElementSibling;
  if (details.style.display === "block") {
    details.style.display = "none";
    button.textContent = "+";
  } else {
    details.style.display = "block";
    button.textContent = "-";
  }
}

// 페이지 로드 시 진행률 업데이트
document.addEventListener("DOMContentLoaded", function () {
  updateProgress('packingList', 'packingProgress');
  updateProgress('preTripTasks', 'preTripProgress');
});

// 진행률 업데이트 기능
function updateProgress(listId, progressId) {
  const list = document.getElementById(listId);
  const items = list.querySelectorAll('li');
  const checkedItems = list.querySelectorAll('input:checked');
  const progress = document.getElementById(progressId);
  const percent = (checkedItems.length / items.length) * 100;
  progress.style.width = percent + '%';
}

// 항목 추가 기능
function addItem() {
  const newItem = document.getElementById('newItem');
  if (newItem.value.trim() !== '') {
    const list = document.getElementById('preTripTasks');
    const listItem = document.createElement('li');
    listItem.className = 'ch1';
    // 항목 추가 시 삭제 버튼 추가
    listItem.innerHTML = `<input type="checkbox" onclick="updateProgress('preTripTasks', 'preTripProgress')"> ${newItem.value}
      <button class="remove-btn" onclick="removeItem(this)">x</button>`;
    list.appendChild(listItem);
    newItem.value = '';
    updateProgress('preTripTasks', 'preTripProgress');
  }
}

// 항목 삭제 기능
function removeItem(button) {
  const listItem = button.parentElement;
  const list = listItem.parentElement;
  list.removeChild(listItem);
  updateProgress(list.id, list.parentElement.querySelector('.progress-bar').id);
}

async function addItem() {
  const newItemInput = document.getElementById('newItem');
  const newItemText = newItemInput.value.trim();

  if (newItemText !== "") {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <input type="checkbox" onclick="updateProgress('preTripTasks', 'preTripProgress')"> ${newItemText}
      <button class="remove-btn" onclick="removeItem(this)">X</button>
    `;

    document.getElementById('preTripTasks').appendChild(listItem);
    newItemInput.value = "";

    // 서버로 항목 저장 요청 보내기
    try {
      const response = await fetch('/add-todo-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item: newItemText })
      });

      if (!response.ok) {
        console.error('항목 저장 실패:', response.statusText);
      }
    } catch (error) {
      console.error('항목 저장 중 오류 발생:', error);
    }
  }
}

function removeItem(button) {
  const listItem = button.parentElement;
  listItem.remove();
  updateProgress('preTripTasks', 'preTripProgress');
}

async function fetchTodoItems() {
  try {
    const response = await fetch('/get-todo-items');
    const items = await response.json();

    const preTripTasks = document.getElementById('preTripTasks');
    items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <input type="checkbox" onclick="updateProgress('preTripTasks', 'preTripProgress')"> ${item.text}
        <button class="remove-btn" onclick="removeItem(this)">X</button>
      `;
      preTripTasks.appendChild(listItem);
    });
  } catch (error) {
    console.error('To-Do 항목 가져오는 중 오류 발생:', error);
  }
}

window.onload = () => {
  fetchTodoItems();
  fetchDocInfo();
};