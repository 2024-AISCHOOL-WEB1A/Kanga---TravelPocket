const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.0404.go.kr/dev/newest_list.mofa');

  let results = [];
  const maxPages = 5; // 크롤링할 최대 페이지 수
  let currentPage = 1;

  while (currentPage <= maxPages) {
    // 현재 페이지의 데이터 추출
    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll('td.subject a');
      return Array.from(rows).map(row => row.innerText.trim());
    });

    results = results.concat(data);S

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
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    currentPage++;
  }

  console.log(results);

  await browser.close();
})();

