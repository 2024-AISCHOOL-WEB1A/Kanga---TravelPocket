const destinationInput = document.getElementById('destination');
const dropdown = document.getElementById('dropdown');
const dateGroup = document.getElementById('dateGroup');
const guestGroup = document.getElementById('guestGroup');
const submitBtn = document.getElementById('submitBtn');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

const countryMapping = {
    '스위스': 194,
    '일본': 32,
    '중국': 188,
    '필리핀': 49,
    '싱가포르': 186,
    '인도네시아': 187,
    '홍콩': 195,
    '타이완': 6,
    '태국': 189,
    '베트남': 185,
    '미국': 190,
    '괌': 191,
    '캐나다': 192
};


dateGroup.style.display = 'flex'; // 날짜 입력 필드 보이기
guestGroup.style.display = 'flex'; // 게스트 입력 필드 보이기

function toggleSubmitButton() {
    const isCountrySelected = destinationInput.value in countryMapping;
    const isDateSelected = checkinInput.value && checkoutInput.value;
    const isDateValid = new Date(checkinInput.value) <= new Date(checkoutInput.value);
    const isCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

    const isFormValid = isCountrySelected && isDateSelected && isDateValid && isCheckboxChecked;
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
            // userId를 전역 변수에 저장할 필요가 없다면 삭제
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

destinationInput.addEventListener('input', toggleSubmitButton); // 입력 필드 변경 시 버튼 상태 업데이트
checkinInput.addEventListener('change', toggleSubmitButton);
checkoutInput.addEventListener('change', toggleSubmitButton);
checkboxes.forEach(checkbox => checkbox.addEventListener('change', toggleSubmitButton));

submitBtn.addEventListener('click', async () => {
    if (submitBtn.disabled) {
        Swal.fire({
            title: '입력 오류 오류',
            text: '모든 정보를 올바르게 입력하세요.',
            icon: 'error',
            customClass: {
                confirmButton: 'custom-confirm-button'
            }
        });
        
        event.preventDefault(); // 기본 동작(페이지 이동) 막기
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
