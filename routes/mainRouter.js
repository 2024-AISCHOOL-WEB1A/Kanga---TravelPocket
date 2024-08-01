const express = require('express')
const router = express.Router()
const app = express();
const path = require('path') // 경로를 수정하는 모듈
const file_path = path.join(__dirname, "../../Kanga---TravelPocket")
const fs = require('fs');
const Papa = require('papaparse');

 /// const csvFilePath = path.join(file_path, '/newsletter/data/safety_content_extracted.csv');
 /// const jsonFilePath = path.join(file_path, '/newsletter/data/safety_notices.json');
 /// 
 /// 
 /// // CSV 파일 읽기
 /// fs.readFile(csvFilePath, 'utf8', (err, data) => {
 ///     if (err) {
 ///         console.error('Error reading the file:', err);
 ///         return;
 ///     }
 /// 
 ///     // CSV 데이터 파싱
 ///     Papa.parse(data, {
 ///         header: true,
 ///         complete: (results) => {
 ///             const safetyNotices = {};
 /// 
 ///             results.data.forEach(row => {
 ///                 const countryIdx = row['country_idx'] && row['country_idx'] !== '미지정' ? parseInt(row['country_idx']) : null;
 ///                 const safetyTitle = row['safety_title'];
 ///                 const safetyContent = row['safety_content'];
 ///                 const createdAt = row['created_at'];
 /// 
 /// 
 ///                 if (countryIdx !== null && safetyTitle && safetyContent) {
 ///                     safetyNotices[countryIdx] = {
 ///                         safety_title: safetyTitle,
 ///                         safety_content: safetyContent,
 ///                         created_at:createdAt
 ///                     };
 ///                 }
 ///             });
 /// 
 ///             // JSON 파일로 저장
 ///             fs.writeFile(jsonFilePath, JSON.stringify(safetyNotices, null, 2), (err) => {
 ///                 if (err) {
 ///                     console.error('Error writing the file:', err);
 ///                     return;
 ///                 }
 ///                 console.log('Data successfully saved to', jsonFilePath);
 ///             });
 ///         }
 ///     });
 /// });
/// 
/// 
/// 
/// 
// --------------------------main-----------------------

router.get('/main', (req, res)=>{
    console.log('main router')
    res.sendFile(file_path+'/main/templates/main.html')
})
router.get('/main', (req, res)=>{
    console.log('main router')
    res.sendFile(file_path+'/main/templates/main.html')
})

router.get('/menu', (req, res)=>{
    res.sendFile(file_path+'/main/templates/menu_bar.html')
})
router.get('/country', (req, res)=>{
    res.sendFile(file_path+'/main/templates/user_country.html')
})

router.get('/date', (req, res)=>{
    res.sendFile(file_path+'/main/templates/user_date.html')
})
router.get('/companion', (req, res)=>{
    res.sendFile(file_path+'/main/templates/user_people.html')
})




router.get('/main/main', (req, res)=>{
    console.log('main router')
    res.sendFile(file_path+'/main/templates/main.html')
})

router.get('/main/menu', (req, res)=>{
    res.sendFile(file_path+'/main/templates/menu_bar.html')
})
router.get('/main/country', (req, res)=>{
    res.sendFile(file_path+'/main/templates/user_country.html')
})

router.get('/main/date', (req, res)=>{
    res.sendFile(file_path+'/main/templates/user_date.html')
})
router.get('/main/companion', (req, res)=>{
    res.sendFile(file_path+'/main/templates/user_people.html')
})

// --------------------- intro ---------------------

router.get('/intro', (req, res)=>{
    res.sendFile(file_path+'/intro/index.html')
})


// --------------------- account---------------------


router.get('/main/login', (req, res)=>{
    res.sendFile(file_path+'/accounts/templates/login.html')
})


router.get('/main/mypage', (req, res)=>{
    res.sendFile(file_path+'/accounts/templates/mypage.html')
})
router.get('/login', (req, res)=>{
    res.sendFile(file_path+'/accounts/templates/login.html')
})


router.get('/mypage', (req, res)=>{
    res.sendFile(file_path+'/accounts/templates/mypage.html')
})




// ---------------------------checklist------------------------
router.get('/main/checklist', (req, res)=>{
    res.sendFile(file_path+'/checklist/templates/user_docs1.html')
})

router.get('/checklist', (req, res)=>{
    res.sendFile(file_path+'/checklist/templates/user_docs1.html')
})
// ------------------------------------- newsletter --------------------------------------

router.get('/main/newsletter', (req, res)=>{
    res.sendFile(file_path+'/newsletter/templates/newsletter.html')
})
router.get('/newsletter', (req, res)=>{
    res.sendFile(file_path+'/newsletter/templates/newsletter.html')
})

router.get('/newsletter', (req, res)=>{
    res.sendFile(file_path+'/newsletter/templates/test.html')
})


// ------------------------------------- static --------------------------------------

router.get('/main/header', (req, res)=>{
    res.sendFile(file_path+'/static/templates/header.html')
})
router.get('/main/footer', (req, res)=>{
    res.sendFile(file_path+'/static/templates/footer.html')
})

//----------------------------------chatbot-----------------------

router.get('/main/chatbot', (req, res)=>{
    res.sendFile(file_path+'/chatbot/templates/chatbot.html')
})


//----------------------------------userinfo------------------------

router.get('/user-info', (req, res)=>{
    res.sendFile(file_path+'/userinfo/templates/userinfo.html')
})



module.exports = router;