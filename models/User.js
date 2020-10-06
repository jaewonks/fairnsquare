const mongoose = require('mongoose')
//몽구스를 이용해서 스키마를 생성한다. 
const bcrypt = require('bcrypt')
const saltRounds = 10 // 몇자리 솔트를 만드는가
const jwt = require('jsonwebtoken')

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

userSchema.pre('save', function( next ) {
    const user = this;
    
    if(user.isModified('password')){    
        console.log('password changed')
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                console.log(err)
                user.password = hash 
                next()
            })
        })
    } else {
        next()
    }
});

/* user.save((err, userInfo) => { ... 이렇게 저장을 하기 전에 무언가를 하고 이리로 보낸다. 
userSchema.pre('save',(next) => {
    솔트를 생성하고 생성된 솔트로 암호회 시킨다.
    비밀번호를 암호화시킨다.
    const user = this;
    if(user.isModified('password')){ 패스워드 부분을 수정할때만 암호화한다.
        console.log('password changed')
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err) return next(err) register라우터로 에러와 함께 보내준다.
            //암호화되지 않은 비번은 onst user = new User(req.body)에 담겨저 schema로 전달됬으니 
            bcrypt.hash(user.password, salt, (err, hash) => { //hash는 암호화된 비번
                if(err) return next(err) register라우터로 에러와 함께 보내준다.
                //암호화된 비번 만드는데 성공
                user.password = hash
                next() 메서드, 자기가 처리하지 못하는 것을 다음 매서드로 던저주는 기능
                }) 
            })
        } else {
            next() next가 있어야 빠져나간다. next가 없으면 이 안에 머문다.
        }
    })

이메일이 있다면 비밀번호 일치 여부 확인 - User.js에서 메소드를 만든다.
user.comparePassword(req.body.password, (err, isMatch) => {
    if(!isMatch) return res.json({ loginSuccess: false, message:'Wrong password! please check it again' })
}) */

userSchema.methods.comparePassword = (rawPW, callback) => {
    //암호화되지 않은 비번과 암호화된 비번 체크
    bcrypt.compare(rawPW, this.password, (err, isMatch) => {
        console.log(this.password)
        if(err) return callback(err)
        callback(null, isMatch) 
        //에러는 없고 isMatch는 true
    })
}

/* user.generateToken((err,user) => {
    if(err) return res.status(400).send(err)
    토큰을 저장한다. 어디에...?
    res.cookie("tokenInCookie", user.token)
    .status(200)
    .json({ loginSuccess:true, userId: user._id })
}) */

userSchema.methods.generateToken = (callback) => {
    const user = this;
    //jsonwebtoken을 이용하여 token생성하기 몽고 DB 아이디(_id)
    //user._id + 'userToken' = token
    const token = jwt.sign(user._id.toHexString(),'userToken')

    user.token = token
    user.save((err, user) => { 
        //userSchema에 저장
        if(err) return callback(err)
        callback(null, user) 
        //에러는 없고 유저 정보만 전달.
    })
    
}


//스키마를 모델로 감싸준다.
const User = mongoose.model('User', userSchema)

//다른 곳에서도 사용 가능하도록 export
module.exports = { User }
