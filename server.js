const { doesNotMatch, doesNotReject } = require('assert')
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser') //미들웨어 클라이언트에서 오는 정보를 분석해서 가진다.
const mongoose = require('mongoose')
const { User } = require('./models/User')
const config = require('./config/key')

app.use(bodyParser.urlencoded({extended: true})) //application/x-www=form-urlencoded에서 분석된 정보를 가져온다.
app.use(bodyParser.json()) //application/json 타입으로 된 것을 분석해서 가져온다.

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
 //원래되던 기능들을 안되게 막아놓은 것(deprecation) 뭔가 에러가 안뜬다고 합니다..
}).then(() => console.log("It's connect to MongoDB well done Jay"))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('hello my first project'))
//회원가입을 위한 라우트
app.post('/register', (req,res) => {
    //회원가입할때 필요한 정보들을 Client에서 가져오면 
    const user = new User(req.body) //클라이언트에서 보내온 정보를 담는다.
    console.log(req.body)
    //그것들을 데이터베이스에 넣어준다 .save() 유저모델에 저장이 된 것
    user.save((err, userInfo) => { //만약 에러가 있다면 클라이언트에 json방식으로 전달.
        if(err) return res.json({ success: false, err }) //상태와 에러 메세지도 함께 전달
        return res.status(200).json({ success: true })
    })
})

app.listen(port, () => console.log(`listening on localhost:${port}`))
