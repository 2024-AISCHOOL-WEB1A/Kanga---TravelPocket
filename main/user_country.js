const countries = [
    { country_idx: 15, name: "미국", flag: "https://flagcdn.com/w320/us.png" },
    { country_idx: 32, name: "일본", flag: "https://flagcdn.com/w320/jp.png" },
    { country_idx: 8, name: "독일", flag: "https://flagcdn.com/w320/de.png" },
    { country_idx: 34, name: "중국", flag: "https://flagcdn.com/w320/cn.png" },
    { country_idx: 48, name: "프랑스", flag: "https://flagcdn.com/w320/fr.png" },
    { country_idx: 37, name: "캐나다", flag: "https://flagcdn.com/w320/ca.png" },
    { country_idx: 50, name: "호주", flag: "https://flagcdn.com/w320/au.png" },
    { country_idx: 10, name: "러시아", flag: "https://flagcdn.com/w320/ru.png" },
    { country_idx: 12, name: "멕시코", flag: "https://flagcdn.com/w320/mx.png" },
    { country_idx: 14, name: "스페인", flag: "https://flagcdn.com/w320/es.png" },
    { country_idx: 23, name: "아르헨티나", flag: "https://flagcdn.com/w320/ar.png" },
    { country_idx: 2, name: "남아프리카 공화국", flag: "https://flagcdn.com/w320/za.png" },

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

