const destinationInput = document.getElementById('destination');
        const dropdown = document.getElementById('dropdown');
        const dateGroup = document.getElementById('dateGroup');
        const guestGroup = document.getElementById('guestGroup');
        const travelForm = document.getElementById('travelForm');
        let userId;

        async function fetchCountries() {
            try {
                const response = await fetch('/countries');
                if (!response.ok) {
                    throw new Error('국가 데이터를 가져오는 데 실패했습니다');
                }
                const countries = await response.json();
                
                dropdown.querySelectorAll('div').forEach((div) => {
                    const countryName = div.dataset.countryName;
                    const countryData = countries.find(country => country.country_name === countryName);
                    if (countryData) {
                        div.dataset.countryIdx = countryData.country_idx;
                    } else {
                        console.warn("국가 데이터가 없거나 잘못된 국가 이름: ${countryName}");
                    }
                });
            } catch (error) {
                console.error('국가 데이터를 가져오는 데 오류 발생:', error);
            }
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
                destinationInput.dataset.countryIdx = e.target.dataset.countryIdx;
                dropdown.style.display = 'none';
                dateGroup.style.display = 'flex';
            }
        });

        document.getElementById('checkout').addEventListener('change', () => {
            guestGroup.style.display = 'flex';
        });

        travelForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const country_idx = destinationInput.dataset.countryIdx;
            const start_date = document.getElementById('checkin').value;
            const end_date = document.getElementById('checkout').value;
            const companion_kid_YN = document.getElementById('child').checked ? 1 : 0;
            const companion_teenager_YN = document.getElementById('teen').checked ? 1 : 0;
            const companion_adult_YN = document.getElementById('adult').checked ? 1 : 0;
            const companion_pet_YN = document.getElementById('pet').checked ? 1 : 0;
            const companion_disabled_YN = document.getElementById('disabled').checked ? 1 : 0;
            
            try {
                const response = await fetch('/save-country', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, country_idx,  start_date, end_date,
                                           companion_kid_YN, companion_teenager_YN, companion_adult_YN,
                                           companion_pet_YN, companion_disabled_YN })
                });
            
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            
                const data = await response.json();
                console.log(data.message);
            } catch (error) {
                console.error('Error:', error);
            }
        });
        

        // 페이지 로드 시 사용자 정보와 국가 데이터를 가져옴
        fetchUserInfo();
        fetchCountries();