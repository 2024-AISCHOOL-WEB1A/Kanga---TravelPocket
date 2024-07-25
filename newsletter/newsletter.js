async function loadCSVData() {
    const response = await fetch('../../backend/results.csv');
    const csvData = await response.text();

    const rows = csvData.split('\n').slice(1);
    const noticeList = document.getElementById('notice-list');

    rows.forEach(row => {
        const cells = row.split(',');

        if (cells.length < 4) return; 

        let [countryIndex, safetyTitle, safetyUrl, createdAt] = cells;

        // URL에서 따옴표를 제거합니다.
        safetyUrl = safetyUrl.replace(/^"|"$/g, '').trim();
        
        const listItem = document.createElement('li');
        listItem.className = 'notice-item';

        const link = document.createElement('a');
        link.href = safetyUrl;
        link.className = 'notice-link';
        link.textContent = safetyTitle;

        const card = document.createElement('div');
        card.className = 'notice-card';
        card.innerHTML = `
            <p><strong>날짜:</strong> ${createdAt}</p>
            <p>상세 내용: ${safetyTitle}에 대한 자세한 설명입니다.</p>
        `;

        listItem.appendChild(link);
        listItem.appendChild(card);
        noticeList.appendChild(listItem);
    });
}

window.onload = loadCSVData;
