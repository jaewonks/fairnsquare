const express = require('express')
const app = express()
const bodyParser = require('body-parser') //미들웨어 클라이언트에서 오는 정보를 분석해서 가진다.
const cookieParser = require("cookie-parser")
const config = require('./config/key')
const { User } = require('./models/User')
const { auth } = require('./middleware/auth')

const port = 5000

app.use(bodyParser.urlencoded({extended: true})) //application/x-www=form-urlencoded에서 분석된 정보를 가져온다.
app.use(bodyParser.json()) //application/json 타입으로 된 것을 분석해서 가져온다.
app.use(cookieParser()); //쿠키를 저장

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
 //원래되던 기능들을 안되게 막아놓은 것(deprecation) 뭔가 에러가 안뜬다고 합니다..
}).then(() => console.log("It's connect to MongoDB well done Jay"))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('hello my first project'))
//회원가입을 위한 라우트

app.get('/api/hello', (req, res) => {
    res.send('Hello')
})

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

  // console.log('ping')
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {

    // console.log('user', user)
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      // console.log('err',err)

      // console.log('isMatch',isMatch)

      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

      //비밀번호 까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다.  어디에 ?  쿠키 , 로컳스토리지 
        res.cookie("tokenInCookie", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {
    //여기 까지 미들웨어를 통과해 왔다는 얘기는  Authentication 이 True 라는 말.
    res.status(200).json({
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
    // console.log('req.user', req.user)
    User.findOneAndUpdate({ _id: req.user._id },
      { token: "" }
      , (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
          success: true
        })
      })
  })


app.listen(port, () => console.log(`listening on localhost:${port}`))
