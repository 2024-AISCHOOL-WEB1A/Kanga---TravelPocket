const countries = [
    { country_idx: 1, name: "미국", flag: "https://flagcdn.com/w320/us.png" },
    { country_idx: 2, name: "일본", flag: "https://flagcdn.com/w320/jp.png" },
    { country_idx: 3, name: "독일", flag: "https://flagcdn.com/w320/de.png" },
    { country_idx: 4, name: "중국", flag: "https://flagcdn.com/w320/cn.png" },
    { country_idx: 5, name: "프랑스", flag: "https://flagcdn.com/w320/fr.png" },
    { country_idx: 6, name: "영국", flag: "https://flagcdn.com/w320/gb.png" },
    { country_idx: 7, name: "이탈리아", flag: "https://flagcdn.com/w320/it.png" },
    { country_idx: 8, name: "캐나다", flag: "https://flagcdn.com/w320/ca.png" },
    { country_idx: 9, name: "호주", flag: "https://flagcdn.com/w320/au.png" },
    { country_idx: 10, name: "브라질", flag: "https://flagcdn.com/w320/br.png" },
    { country_idx: 11, name: "인도", flag: "https://flagcdn.com/w320/in.png" },
    { country_idx: 12, name: "러시아", flag: "https://flagcdn.com/w320/ru.png" },
    { country_idx: 13, name: "멕시코", flag: "https://flagcdn.com/w320/mx.png" },
    { country_idx: 14, name: "스페인", flag: "https://flagcdn.com/w320/es.png" },
    { country_idx: 15, name: "아르헨티나", flag: "https://flagcdn.com/w320/ar.png" },
    { country_idx: 16, name: "남아프리카 공화국", flag: "https://flagcdn.com/w320/za.png" },
    { country_idx: 17, name: "사우디 아라비아", flag: "https://flagcdn.com/w320/sa.png" },
    { country_idx: 18, name: "터키", flag: "https://flagcdn.com/w320/tr.png" },
    { country_idx: 19, name: "인도네시아", flag: "https://flagcdn.com/w320/id.png" }
];

const countryList = document.getElementById('country-list');

countries.forEach((country, index) => {
    const countryItem = document.createElement('div');
    countryItem.classList.add('country-item');

    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.name = 'country';
    radioButton.id = `country-${index}`;
    radioButton.value = JSON.stringify({ country_idx: country.country_idx, country_name: country.name });

    const flagImg = document.createElement('img');
    flagImg.src = country.flag;
    flagImg.alt = `${country.name} Flag`;

    const label = document.createElement('label');
    label.htmlFor = `country-${index}`;
    label.textContent = country.name;

    countryItem.appendChild(radioButton);
    countryItem.appendChild(flagImg);
    countryItem.appendChild(label);

    countryList.appendChild(countryItem);
});

document.getElementById('country-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const selectedCountry = document.querySelector('input[name="country"]:checked');
    if (selectedCountry) {
        const countryData = JSON.parse(selectedCountry.value); // 

        try {
            const response = await fetch('/save-country', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(countryData)
            });

            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('에러 발생:', error);
        }
    }
});

