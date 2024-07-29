let currentIndex = 0;
const groups = document.querySelectorAll('.card[data-group="1"]');
const totalGroups = document.querySelectorAll('.card[data-group]').length / groups.length;

// 카드뉴스 원문 맞춰서 내용 넣어주세요. 예시로 첨부 해두었습니다. 
const detailedContent = {
    detailedContent1: "ㅇ 미국내 일부 식품 제조회사에서 대마 성분이 포함된 불법식품을 시중에서 판매하고 있습니다.<br><br>ㅇ 상기 불법제품은 간식과 혼동할 수 있도록  유사 브랜드, 로고, 그림 등을 사용해 제작 유통하고 있습니다.<br><br>ㅇ 미 식품의약청(FDA)은 해당 불법제품을 다른 식품으로 오인, 섭취하는 것에 대해 우려하고 있습니다. 또한 불법식품 섭취로 인해 병원 치료 등 피해가 발생할 수 있음을 경고하고 있습니다. <br><br>주미대사관 영사부",
    detailedContent2: "대마 및 대마 성분 제품의 위험성을 경고하는 홍보 동영상 <br><br> (클릭) 주미대사관 영사부",
    detailedContent3: "최근 해외 체류 우리 국민들을 대상으로 한인회 홈페이지, 온라인 커뮤니티, 오픈채팅방 등 각종 소셜미디어를 통한 중고물품 거래 사기 사건 발생이 증가하고 있습니다.<br><br>중고거래의 경우, 한국의 은행 정보 및 신분증 등을 제시하더라도 타인의 명의를 도용한 속칭 대포통장을 이용한 경우 추적이 어려워 수사 진행이 쉽지 않고 사후 피해보상에도 어려움이 있습니다.<br><br>주요 피해 사례- 귀국을 앞두고 사용하던 차량 및 고가의 물건을 구매하려고 선지급 하였으나 물건 미수령 및 판매자와 연락두절됨.<br><br>- 민원인의 제보에 따르면, 동일한 작성자가 수 개의 카톡아이디(hsk121, nno1101, wlsrnr8, boopo11, wlsdk8199, wlsdk8871)를 사용.<br><br>- 중고거래 물품 : 차량, 세라젬, 다이슨 에어랩, 다이슨 무선 청소기, 공기 청정기, 김치냉장고, 세탁기, 스마트 TV 등.중고물품 거래시 유의 사항- 지나치게 싼 물건은 우선 의심.<br><br>- 거래 전 선입금 요구시 유의하기.- 상품의 다른 모습의 실시간 사진을 요청하기(물건 위에 판매자 정보와 날짜를 적은 메모 요청 등).<br><br>- 휴대폰 번호 확인하여 직접 통화.<br><br>- 물건은 직접 수령하기 전까지 돈 지급하지 말 것재외 우리 국민 및 교민께서는 구매 대금 선지급을 하지 않는 등 중고물품 거래시 각별히 유의하기 바라며, 피해를 당했거나 사기의 의심이 있을 경우 해당 SNS 관리자(망고마켓, 교민신문 카톡방 등)에게 통보하고 괌 경찰서에 신고하시기 바랍니다. ",
    detailedContent4: "",
    detailedContent5: "",
    detailedContent6: "▢︎ 최근 미국의 유명 식료품점 체인인 Trader Joe's에서 판매하는 베이글 시즈닝(아래 그림 참조) 제품을 구입 후 한국으로 입국하는 과정에서, 동 제품이 국내 반입 제한물품 대상임을 인지하지 못한 여행객들에 대한 적발 사례가 보고되고 있습니다.<br><br> ▢︎ 인천공항세관은 POPPY SEED(양귀비 종자)가 함유된 아래 제품은「︎마약류 관리에 관한 법률」︎제2조제2호가목에 마약으로 지정된 양귀비과의 '파파베르 솜니페룸 엘(Papaver Somniferum L.)'이 검출된 제품으로 확인되어 국내 반입이 제한된다고 밝힌 바, 해당 제품을 국내로 반입하는 일이 없도록 각별히 유의하시기 바랍니다. "
};

function updateCards() {
    const allCards = document.querySelectorAll('.card[data-group]');
    allCards.forEach(card => card.style.display = 'none');
    document.querySelectorAll(`.card[data-group="${currentIndex + 1}"]`).forEach(card => card.style.display = 'block');
}

function slideLeft() {
    currentIndex = (currentIndex - 1 + totalGroups) % totalGroups;
    updateCards();
}

function slideRight() {
    currentIndex = (currentIndex + 1) % totalGroups;
    updateCards();
}

function showModal(card, detailKey) {
    const modal = document.getElementById('card-modal');
    const modalContent = modal.querySelector('.modal-content');
    const detailedContentHtml = `
        <div class="card-header">
            ${card.querySelector('.card-header').innerHTML}
        </div>
        <div class="card-body">
            <p>${card.querySelector('.card-body p').innerHTML}</p>
            <p>${detailedContent[detailKey]}</p>
        </div>
        <div class="card-footer">
            ${card.querySelector('.card-footer').innerHTML}
        </div>
    `;
    modalContent.innerHTML = detailedContentHtml;
    modal.classList.add('show');
}

function closeModal() {
    document.getElementById('card-modal').classList.remove('show');
}

updateCards();




// async function loadCSVData() {
//     const response = await fetch('../../backend/results.csv');
//     const csvData = await response.text();

//     const rows = csvData.split('\n').slice(1);
//     const noticeList = document.getElementById('notice-list');

//     rows.forEach(row => {
//         const cells = row.split(',');

//         if (cells.length < 4) return; 

//         let [countryIndex, safetyTitle, safetyUrl, createdAt] = cells;

//         // URL에서 따옴표를 제거합니다.
//         safetyUrl = safetyUrl.replace(/^"|"$/g, '').trim();
        
//         const listItem = document.createElement('li');
//         listItem.className = 'notice-item';

//         const link = document.createElement('a');
//         link.href = safetyUrl;
//         link.className = 'notice-link';
//         link.textContent = safetyTitle;

//         const card = document.createElement('div');
//         card.className = 'notice-card';
//         card.innerHTML = `
//             <p><strong>날짜:</strong> ${createdAt}</p>
//             <p>상세 내용: ${safetyTitle}에 대한 자세한 설명입니다.</p>
//         `;

//         listItem.appendChild(link);
//         listItem.appendChild(card);
//         noticeList.appendChild(listItem);
//     });
// }

// window.onload = loadCSVData;
