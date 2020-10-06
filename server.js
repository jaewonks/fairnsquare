const express = require('express')
const app = express()
const bodyParser = require('body-parser') //미들웨어 클라이언트에서 오는 정보를 분석해서 가진다.
const cookieParser = require("cookie-parser")
const config = require('./config/key')
const mongoose = require('mongoose')
const { User } = require('./models/User')
const { auth } = require('./middleware/auth')

const port = 5000

app.use(bodyParser.urlencoded({extended: true})) //application/x-www=form-urlencoded에서 분석된 정보를 가져온다.
app.use(bodyParser.json()) //application/json 타입으로 된 것을 분석해서 가져온다.
app.use(cookieParser()); //쿠키를 저장

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
 //원래되던 기능들을 안되게 막아놓은 것(deprecation) 뭔가 에러가 안뜬다고 합니다..
}).then(() => console.log("It's connect to MongoDB well done Jay"))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('hello my first project'))
//회원가입을 위한 라우트
app.post('/api/users/register', (req,res) => {
    //회원가입할때 필요한 정보들을 Client에서 가져오면 
    const user = new User(req.body) //클라이언트에서 보내온 정보를 담는다.
    //console.log(req.body)
    //그것들을 데이터베이스에 넣어준다 .save() 유저모델에 저장이 된 것
    //..user모델에서 저장하기 전에 비밀번호를 암호화 하는 중
    user.save((err, user) => { //만약 에러가 있다면 클라이언트에 json방식으로 전달.
        if (err) return res.json({ success: false, err }); //상태와 에러 메세지도 함께 전달
        return res.status(200).json({ success: true })
    })
})
app.post('/api/users/login', (req, res) => {
    //데이터 베이스 안에서 요청된 이메일 찾기
    User.findOne({ email: req.body.email }, (err,user) => {
        if(!user) return res.json({
            loginSuccess: false, message: 'Fail to login'
        })
  
        //이메일이 있다면 비밀번호 일치 여부 확인 - User.js에서 메소드를 만든다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            //console.log('err',err)
            //console.log('isMatch', isMatch)
            if(!isMatch) return res.json({ loginSuccess: false, message:'Wrong password! please check it again' })
            //console.log(user)
            //비밀번호까지 일치하면 토큰을 생성하기 - User.js에서 메소드를 만든다.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err)
                //토큰을 저장한다. 어디에...?
                res.cookie("tokenInCookie", user.token)
                .status(200)
                .json({ loginSuccess:true, userId: user._id })
            })
        })
    })
})

app.get('/api/users/auth', auth, (req, res) => { 
/*     middleware/auth.js에서 가져온다.         
        req.token = token;
        req.user = user; */
   //여기까지 미들웨어를 통과해왔다는 얘기는 Authentication이 true
   // ex)role 0 일반유저 role 1 어드만 role 2 특정부서 어드민 .. 등으로 부여하는 것
   //console.log(token)
   //console.log(user)
   res.status(200).json({
       //user 정보 
       _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
   })
})

app.get('/api/users/logout', auth, (req, res) => {
    //로그아웃하려는 유저를 데이터베이스에서 찾는다.
    /*  middleware/auth.js에서 가져온        
        req.token = token;
        req.user = user; */
    User.findOneAndUpdate({_id: req.user._id},{ token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        })
    })
})


app.listen(port, () => console.log(`listening on localhost:${port}`))
