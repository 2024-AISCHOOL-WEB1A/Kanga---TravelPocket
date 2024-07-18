const mysql = require('mysql2')
//mysql을 설치하면 외부 db사용할떄 오류, 그래서 마에큐2 를 씀
const conn= mysql.createConnection({
    host : "project-db-stu3.smhrd.com",
    port: 3307,
    database:"NODEJS",
    password: "aischool1",
    user : "Insa5_JSA_hacksim_1"
})
conn.connect()
console.log("DB 연결됨")
module.exports=conn;