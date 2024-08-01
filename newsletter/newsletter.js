document.addEventListener('DOMContentLoaded', () => {
    const countryMapping = {
        '그리스': 1,
        '남아프리카공화국': 2,
        '네팔': 3,
        '뉴질랜드': 4,
        '니카라과': 5,
        '타이완': 6,
        '덴마크': 7,
        '독일': 8,
        '라오스': 9,
        '러시아': 10,
        '레바논': 11,
        '멕시코': 12,
        '모리셔스': 13,
        '몽골': 14,
        '미국': 15,
        '미얀마': 16,
        '방글라데시': 17,
        '볼리비아': 18,
        '세네갈': 19,
        '수단': 20,
        '스웨덴': 21,
        '아랍에미리트': 22,
        '아르헨티나': 23,
        '아이슬란드': 24,
        '에콰도르': 25,
        '엘살바도르': 26,
        '오만': 27,
        '온두라스': 28,
        '이라크': 29,
        '이란': 30,
        '이스라엘': 31,
        '일본': 32,
        '중국': 33,
        '칠레': 34,
        '캄보디아': 35,
        '캐나다': 36,
        '케냐': 37,
        '콜롬비아': 38,
        '쿠바': 39,
        '태국': 40,
        '튀니지': 41,
        '튀르키예': 42,
        '파라과이': 43,
        '파키스탄': 44,
        '파푸아뉴기니': 45,
        '페루': 46,
        '프랑스': 47,
        '필리핀': 48,
        '호주': 49,
        '미지정': 184,
        '베트남': 185,
        '싱가포르': 186,
        '인도네시아': 187,
        '중국': 188,
        '태국': 189,
        '미국': 190,
        '괌': 191,
        '캐나다': 192,
        '호주': 193,
        '스위스': 194,
        '홍콩': 195
    };

    // countryMapping의 역 맵핑 생성
    const reverseCountryMapping = Object.fromEntries(
        Object.entries(countryMapping).map(([name, idx]) => [idx, name])
    );

    const slider = document.querySelector('.slider');
    const detailedContent = {};

    // 슬라이더 내용 생성 함수
    const createCard = (countryIdx, safetyTitle, safetyContent, createdAt, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.group = Math.floor(index / 3) + 1; // 3개씩 묶어 그룹 설정
        card.style.display = 'none'; // 초기에는 모두 숨김
        card.onclick = () => showModal(card, `detailedContent${index + 1}`);

        // 역 맵핑을 사용하여 국가 이름 가져오기
        const countryName = reverseCountryMapping[countryIdx] || '미지정';

        card.innerHTML = `
            <div class="card-header">
                <div class="country_name_container">
                    <div class="country_name">${countryName}</div>
                </div>
                <div class="text-secondary">
                    <i class="fa fa-ellipsis-h"></i>
                </div>
            </div>
            <div class="card-body">
                <p class="safety_title">${safetyTitle}</p>
            </div>
            <div class="card-footer">
                <div class="created_at">작성일 : ${createdAt}</div>
            </div>
        `;

        slider.appendChild(card);
        detailedContent[`detailedContent${index + 1}`] = safetyContent;
    };

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
        modal.style.display = 'block'; // Ensure the modal is visible
    }

    function closeModal() {
        const modal = document.getElementById('card-modal');
        if (modal) {
            modal.style.display = 'none'; // Ensure the modal is hidden
        }
    }

    // JSON 파일 로드 및 데이터 처리
    fetch('./data/safety_notices.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // JSON 데이터를 바탕으로 카드 생성
            Object.keys(data).forEach((key, index) => {
                const { safety_title, safety_content, created_at } = data[key];
                const countryIdx = parseInt(key, 10);
                createCard(countryIdx, safety_title, safety_content, created_at, index);
            });

            // 카드 생성 완료 후 총 그룹 수 계산
            const totalGroups = Math.ceil(document.querySelectorAll('.card').length / 3);

            let currentIndex = 1; // 현재 그룹 인덱스 (1부터 시작)

            function updateCards() {
                const allCards = document.querySelectorAll('.card');
                allCards.forEach(card => card.style.display = 'none');
                document.querySelectorAll(`.card[data-group="${currentIndex}"]`).forEach(card => card.style.display = 'block');
            }

            function slideLeft() {
                currentIndex = (currentIndex - 1) < 1 ? totalGroups : (currentIndex - 1);
                updateCards();
            }

            function slideRight() {
                currentIndex = (currentIndex + 1) > totalGroups ? 1 : (currentIndex + 1);
                updateCards();
            }

            // 초기 카드 업데이트
            updateCards();

            // Event listeners for sliding
            document.querySelector('.slider-button.left').addEventListener('click', slideLeft);
            document.querySelector('.slider-button.right').addEventListener('click', slideRight);
            document.querySelector('.modal-close').addEventListener('click', closeModal);
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });
});
