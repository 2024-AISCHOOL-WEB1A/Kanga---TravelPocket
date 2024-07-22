import React, {useState} from 'react';
import * as S from './templates/mypage.html'

const mypage = () =>{
    const[uploadedImage, setUploadedImage] = useState(null);

    const onChangeImage = e => {
        const file = e.target.files[0]
        const imageurl = URL.createObjectURL(file);
        setUploadedImage(imageurl)
    }
    return (
        <S.MypageWhole>
        <div>
            <div>
            <p>My Page</p>
            <img src="./images/logout.png" alt="로그아웃" />
            </div>
            <div>
            {uploadedImage ? (
                <S.MyProfileImg src={uploadedImage} alt="프로필 없을때" />
            ) : (
                <S.MyProfileImg src="./images/profile.png" alt="프로필사진" />
            )}
            <input type="file" onChange={onChangeImage} />
            </div>
        </div>
        </S.MypageWhole>
    );
    };
    export default Mypage;