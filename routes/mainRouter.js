const express = require('express')
const router = express.Router()
const path = require('path') // 경로를 수정하는 모듈
const file_path = path.join(__dirname, "../../Kanga---TravelPocket")


// app.use(express.static(path.join(__dirname, '/main/templates')));
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/main/templates/main.html'));
// });


router.get('/', (req, res)=>{
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

router.get('/checklist', (req, res)=>{
    res.sendFile(file_path+'/checklist/templates/user_doc.html')
})



// ------------------------------------- static --------------------------------------

router.get('/header', (req, res)=>{
    res.sendFile(file_path+'/public/static/templates/header.html')
})
router.get('/footer', (req, res)=>{
    res.sendFile(file_path+'/public/static/templates/footer.html')
})
router.get('/index', (req, res)=>{
    res.sendFile(file_path+'/public/static/templates/index.html')
})




module.exports = router;