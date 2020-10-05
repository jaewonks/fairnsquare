const mongoose = require("mongoose")
//몽구스를 이용해서 스키마를 생성한다. 
const userSchema = mongoose.Schema({
    name: {
        type: String, 
        maxlength: 50
    },
    email: {
        type: String, //뛰어쓰기를 제거해준다.
        trim: true,
        unique: 1
    },
    password: {
        type: String, 
        maxlength: 5
    },
    lastname: {
        type: String, 
        maxlength: 50
    },
    role: {
        type: Number, 
        maxlength: 5
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: { //토큰 유효기간
        type: Number
    }
})
//스키마를 모델로 감싸준다.
const User = mongoose.model('User', userSchema)
//다른 곳에서도 사용 가능하도록 export
module.exports = {User}