var firebaseEmailAuth; //파이어베이스 email 인증 모듈 전역변수
var firebaseDatabase; //파이어베이스 db 모듈 전역변수
var userInfo; //가입한 유저의 정보. object 타입
//파이어 베이스 초기화 코드
var config = {
    apiKey: "AIzaSyDY_rShHJYXanLrhjgpyee5jzfyrctIwok",
    authDomain: "mini-project-ce8f4.firebaseapp.com",
    databaseURL: "https://mini-project-ce8f4-default-rtdb.firebaseio.com",
    projectId: "mini-project-ce8f4",
    storageBucket: "mini-project-ce8f4.appspot.com",
    messagingSenderId: "267780174541",
    appId: "1:267780174541:web:9bce134f9caa99db636f84",
    measurementId: "G-FXC0X6HCRP"
};

firebase.initializeApp(config);

firebaseEmailAuth = firebase.auth(); //파이어베이스 인증 객체
firebaseDatabase = firebase.database(); //파이어베이스 데이터베이스 객체

// ─────────────────────────────────────────────────────────────────────────
// 여기까진 변동 없음


//제이쿼리를 사용한다.
$(document).ready(function () {

    //가입버튼 눌렀을 때
    $(document).on('click', '.login', function () {

        //제이쿼리 선택자와 val() 함수를 이용해서 이메일,비밀번호 값을 가져온다. 
        var email = $('#email').val();
        var password = $('#pwd').val();
        //로그인 버튼 체크용입니다 지우면 안됨
        //alert("로그인 버튼 눌렸음" + email + ":" + password);

        //파이어베이스 이메일 로그인 함수
        firebaseEmailAuth.signInWithEmailAndPassword(email, password)
            .then(function (firebaseUser) {

                //성공하면 firebaseUser에 유저 정보 값이 담겨 넘어온다.
                loginSuccess(firebaseUser);

            })
            .catch(function (error) {
                // 실패했을 때 에러 처리
                alert(error);
                alert("로그인 실패");
            });

    });
});

//로그인 성공했을 때
function loginSuccess(firebaseUser) {
    alert("로그인 성공");
    isLogin = true;
    //로그인 성공한 유저 id 확인해 보기 - firebase database에 접근해서 데이터 조회 하는 함수
    firebaseDatabase.ref("users/" + firebaseUser.uid).once('value').then(function (snapshot) {
        //alert(snapshot.val().name)
    });

    //메인 페이지로 이동
    window.location.href = "../../main/template/main_body.html"

    
}

var firebaseEmailAuth; //파이어베이스 email 인증 모듈 전역변수
var firebaseDatabase; //파이어베이스 db 모듈 전역변수
var userInfo; //가입한 유저의 정보. object 타입
//파이어 베이스 초기화 코드
var config = {
    apiKey: "AIzaSyDY_rShHJYXanLrhjgpyee5jzfyrctIwok",
    authDomain: "mini-project-ce8f4.firebaseapp.com",
    databaseURL: "https://mini-project-ce8f4-default-rtdb.firebaseio.com",
    projectId: "mini-project-ce8f4",
    storageBucket: "mini-project-ce8f4.appspot.com",
    messagingSenderId: "267780174541",
    appId: "1:267780174541:web:9bce134f9caa99db636f84",
    measurementId: "G-FXC0X6HCRP"
};
firebase.initializeApp(config);

firebaseEmailAuth = firebase.auth();
firebaseDatabase = firebase.database();


//제이쿼리 
$(document).ready(function () {

    //가입버튼 눌렀을 때 작동하는 함수
    $(document).on('click', '.join', function () {

        //jquery를 이용해서 입력된 값을 가져온다.  
        var email = $('#email').val();
        var password = $('#pwd').val();
        var confirmPassword = $('#confirm_pwd').val();
        var height = $('#height').val();
        var weight = $('#weight').val();
        var birthdate = $('#birthdate').val();
        var gender = $('input[name="gender"]:checked').val();

        //이메일로 가입 버튼 눌렀을 때 작동되는 함수 - firebase 인증 모듈
        firebaseEmailAuth.createUserWithEmailAndPassword(email, password).then(function (user) {

            userInfo = user; //가입 후 callBack 함수로 생성된 유저의 정보가 user에 담겨서 넘어온다. 전역변수에 할당.

            //작동 확인용
            console.log("userInfo/" + userInfo); //오브젝트 타입
            console.log("userInfo.currentUser/" + userInfo.currentUser); //안됨
            console.log("userInfo.uid/" + userInfo.uid); //vPArtCHqPpOeIOpidEfug0Kgq3v1

            //성공했을 때 작동되는 함수
            logUser();

        }, function (error) {
            //에러가 발생했을 때 
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);

        });

        //가입 성공했을 때 호출 되는 함수 - 위의 firebase의 인증 모듈과 다른 database 모듈임을 확인하자.
        function logUser() {
            var ref = firebaseDatabase.ref("users/" + userInfo.uid); //저장될 곳을 users라는 부모 키를 레퍼런스로 지정.

            //저장 형식
            var obj = {
                email: email,
                height: height,
                weight: weight,
                birthdate: birthdate,
                gender: gender
            };

            ref.set(obj); // 고유한 자식 키가 하나 생셩이 되면서 json 삽입
            alert("가입성공");

            //메인 페이지로 이동시키고 세션 저장시키기
            window.location.href = "login.html"
        }


    });
});