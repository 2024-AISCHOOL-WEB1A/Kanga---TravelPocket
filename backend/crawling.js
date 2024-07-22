const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 국가 이름과 country_idx 매핑 객체
const countryMap = {
  '그리스': 1,
  '남아프리카공화국': 2,
  '네팔': 3,
  '뉴질랜드': 4,
  '니카라과': 5,
  '대만': 6,
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
  '전체국가': 33,
  '중국': 34,
  '칠레': 35,
  '캄보디아': 36,
  '캐나다': 37,
  '케냐': 38,
  '콜롬비아': 39,
  '쿠바': 40,
  '태국': 41,
  '튀니지': 42,
  '튀르키예': 43,
  '파라과이': 44,
  '파키스탄': 45,
  '파푸아뉴기니': 46,
  '페루': 47,
  '프랑스': 48,
  '필리핀': 49,
  '호주': 50
};

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.0404.go.kr/dev/newest_list.mofa');

  let results = [];
  const maxPages = 10; // 크롤링할 최대 페이지 수
  let currentPage = 1;

  // 헤더 추가
  results.push('country_idx,safety_title,safety_url,created_at');

  while (currentPage <= maxPages) {
    // 현재 페이지의 데이터 추출
    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr');
      return Array.from(rows).map(row => {
        const country = row.querySelector('td.bb_ctr1')?.innerText.trim() || '';
        const title = row.querySelector('td.subject a')?.innerText.trim() || '';
        const date = row.querySelector('td.date')?.innerText.trim() || '';
        const href = row.querySelector('td.subject a')?.getAttribute('href') || '';
        const idMatch = href.match(/'([^']+)'/);
        if (idMatch) {
          const id = idMatch[1];
          const url = `https://www.0404.go.kr/dev/newest_view.mofa?id=${id}&pagenum=1&mst_id=MST0000000000041&ctnm=&div_cd=&st=title&stext=`;
          return { country, title, url, date };
        }
        return null;
      }).filter(Boolean); // null 값을 제거합니다.
    });

    for (let item of data) {
      // country_idx는 countryMap 객체를 사용하여 매핑된 값을 가져옵니다.
      const countryIdx = countryMap[item.country] || '미지정'; // 매핑되지 않은 국가에 대해 '미지정' 처리

      // created_at 날짜 형식을 yyyy-mm-dd로 변환
      const dateParts = item.date.split('.');
      let formattedDate = '0000-00-00'; // 기본값 설정
      if (dateParts.length === 3) {
        formattedDate = `${dateParts[0].trim()}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
      }

      // CSV 데이터에 따옴표를 추가하여 쉼표가 포함될 경우 문제를 방지
      const escapeCSV = (str) => `"${str.replace(/"/g, '""')}"`;

      // 추출한 데이터를 배열에 추가
      results.push(`${countryIdx},${escapeCSV(item.title)},${escapeCSV(item.url)},${formattedDate}`);
    }

    // 다음 페이지로 이동
    const nextPageExists = await page.evaluate(() => {
      const nextButton = document.querySelector('a.next');
      if (nextButton) {
        nextButton.click();
        return true;
      }
      return false;
    });

    if (!nextPageExists) {
      break; // 다음 페이지가 없으면 종료
    }

    // 페이지 로딩을 기다립니다.
    await new Promise(resolve => setTimeout(resolve, 2000)); // 잠시 대기 (2초)
    currentPage++;
  }

  // 결과를 CSV 파일로 저장
  const csvContent = results.join('\n');
  fs.writeFileSync(path.join(__dirname, 'results.csv'), csvContent, 'utf8');

  console.log('크롤링 결과가 results.csv 파일에 저장되었습니다.');

  await browser.close();
})();
