const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(rawPW,callback){
    bcrypt.compare(rawPW, this.password, function(err, isMatch){
        if (err) return callback(err);
        callback(null, isMatch)
    })
}

userSchema.methods.generateToken = function (callback) {
    const user = this;
    console.log('user._id', user._id)

    // jsonwebtoken을 이용해서 token을 생성하기 
    const token = jwt.sign(user._id.toHexString(), 'userToken')
    console.log(token)
    // user._id + 'secretToken' = token 
    // -> 
    // 'secretToken' -> user._id

    user.token = token
    user.save(function (err, user) {
        if (err) return callback(err)
        callback(null, user)
    })
}

userSchema.statics.findByToken = function(token, callback) {
    var user = this;
    // user._id + ''  = token
    //토큰을 decode 한다. 
    console.log(user)
    jwt.verify(token, 'userToken', function (err, decoded) {
        //console.log(token)
        //console.log(user)
        //유저 아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            console.log(user)
            if (err) return callback(err);
            callback(null, user)
        })
    })
}

//스키마를 모델로 감싸준다.
const User = mongoose.model('User', userSchema)

//다른 곳에서도 사용 가능하도록 export
module.exports = { User }
