const countries = [
    { name: "미국", flag: "https://flagcdn.com/w320/us.png" },
    { name: "일본", flag: "https://flagcdn.com/w320/jp.png" },
    { name: "독일", flag: "https://flagcdn.com/w320/de.png" },
    { name: "중국", flag: "https://flagcdn.com/w320/cn.png" },
    { name: "프랑스", flag: "https://flagcdn.com/w320/fr.png" },
    { name: "영국", flag: "https://flagcdn.com/w320/gb.png" },
    { name: "이탈리아", flag: "https://flagcdn.com/w320/it.png" },
    { name: "캐나다", flag: "https://flagcdn.com/w320/ca.png" },
    { name: "호주", flag: "https://flagcdn.com/w320/au.png" },
    { name: "브라질", flag: "https://flagcdn.com/w320/br.png" },
    { name: "인도", flag: "https://flagcdn.com/w320/in.png" },
    { name: "러시아", flag: "https://flagcdn.com/w320/ru.png" },
    { name: "멕시코", flag: "https://flagcdn.com/w320/mx.png" },
    { name: "스페인", flag: "https://flagcdn.com/w320/es.png" },
    { name: "아르헨티나", flag: "https://flagcdn.com/w320/ar.png" },
    { name: "남아프리카 공화국", flag: "https://flagcdn.com/w320/za.png" },
    { name: "사우디 아라비아", flag: "https://flagcdn.com/w320/sa.png" },
    { name: "터키", flag: "https://flagcdn.com/w320/tr.png" },
    { name: "인도네시아", flag: "https://flagcdn.com/w320/id.png" }
];

const countryList = document.getElementById('country-list');

countries.forEach((country, index) => {
    const countryItem = document.createElement('div');
    countryItem.classList.add('country-item');

    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.name = 'country';
    radioButton.id = `country-${index}`;
    radioButton.value = country.name;


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