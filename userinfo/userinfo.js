const destinationInput = document.getElementById('destination');
const dropdown = document.getElementById('dropdown');
const dateGroup = document.getElementById('dateGroup');
const guestGroup = document.getElementById('guestGroup');
const submitBtn = document.getElementById('submitBtn');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

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

dateGroup.style.display = 'flex'; // 날짜 입력 필드 보이기
guestGroup.style.display = 'flex'; // 게스트 입력 필드 보이기

function toggleSubmitButton() {
    const isCountrySelected = destinationInput.value in countryMapping;
    const isDateSelected = checkinInput.value && checkoutInput.value;
    const isCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

    const isFormValid = isCountrySelected && isDateSelected && isCheckboxChecked;
    submitBtn.disabled = !isFormValid;
    
}

async function fetchUserInfo() {
    try {
        const response = await fetch('/session');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.loggedIn) {
            console.log('로그인 상태:', data.user);
            userId = data.user.id; // 전역 변수에 userId를 저장
            console.log('사용자 ID:', userId);
        } else {
            console.log('로그인되지 않은 상태입니다.');
        }
    } catch (error) {
        console.error('로그인 상태 확인 중 오류:', error);
    }
}
fetchUserInfo();

destinationInput.addEventListener('focus', () => {
    dropdown.style.display = 'block';
});

dropdown.addEventListener('click', (e) => {
    if (e.target.tagName === 'DIV') {
        destinationInput.value = e.target.textContent;
        dropdown.style.display = 'none';
        toggleSubmitButton(); // 버튼 상태 초기화
    }
});

checkinInput.addEventListener('change', toggleSubmitButton);
checkoutInput.addEventListener('change', toggleSubmitButton);
checkboxes.forEach(checkbox => checkbox.addEventListener('change', toggleSubmitButton));

submitBtn.addEventListener('click', async () => {
    if (submitBtn.disabled) {
        alert('모든 항목을 올바르게 입력해주세요.');
        return;
    }

    const travelInfo = {
        country_idx: countryMapping[destinationInput.value],
        start_date: checkinInput.value,
        end_date: checkoutInput.value,
        companion_kid_YN: document.getElementById('companion_kid').checked ? 1 : 0,
        companion_teenager_YN: document.getElementById('companion_teenager').checked ? 1 : 0,
        companion_adult_YN: document.getElementById('companion_adult').checked ? 1 : 0,
        companion_pet_YN: document.getElementById('companion_pet').checked ? 1 : 0,
        companion_disabled_YN: document.getElementById('companion_disabled').checked ? 1 : 0
    };

    try {
        console.log('Sending travel info:', travelInfo);
        const response = await fetch('/travel-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(travelInfo)
        });

        if (response.ok) {
            alert('여행 정보가 저장되었습니다.');
        } else {
            const result = await response.json();
            alert('저장 실패: ' + result.message);
        }
    } catch (error) {
        console.error('저장 중 오류:', error);
        alert('저장 중 오류가 발생했습니다.');
    }
});

// 초기 상태 체크
toggleSubmitButton();
