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
    // calculateDDay(info.star); // 목표 날짜를 설정하세요
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