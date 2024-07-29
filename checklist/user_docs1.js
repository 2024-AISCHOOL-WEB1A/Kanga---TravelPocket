function updateProgress(listId) {
  const list = document.getElementById(listId);
  const items = list.getElementsByTagName('li');
  let completedCount = 0;

  for (let i = 0; i < items.length; i++) {
      const checkbox = items[i].getElementsByTagName('input')[0];
      if (checkbox.checked) {
          items[i].classList.add('completed');
          completedCount++;
      } else {
          items[i].classList.remove('completed');
      }
  }

  const progressId = listId === 'packingList' ? 'packingProgress' : 'preTripProgress';
  const progress = document.getElementById(progressId);
  progress.value = (completedCount / items.length) * 100;
}

function addItem() {
  const newItemText = document.getElementById('newItem').value;
  if (newItemText.trim() === '') return; // 빈 항목은 추가하지 않음

  const ul = document.getElementById('preTripTasks');
  const li = document.createElement('li');
  li.classList.add('ch1');
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.onclick = function() { updateProgress('preTripTasks'); };

  const text = document.createTextNode(' ' + newItemText);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = function() {
      ul.removeChild(li);
      updateProgress('preTripTasks');
  };

  li.appendChild(checkbox);
  li.appendChild(text);
  li.appendChild(deleteButton);
  ul.appendChild(li);

  document.getElementById('newItem').value = ''; // 입력 필드 비우기

  updateProgress('preTripTasks');
}

document.addEventListener("DOMContentLoaded", function() {
  const includeElements = document.querySelectorAll('[data-include-path]');
  
  includeElements.forEach(el => {
      const includePath = el.getAttribute('data-include-path');
      
      fetch(includePath)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok ' + response.statusText);
              }
              return response.text();
          })
          .then(data => {
              el.innerHTML = data;
          })
          .catch(error => {
              console.error('Error including path:', error);
              el.innerHTML = '<p>Error loading content. Please try again later.</p>';
          });
  });
});