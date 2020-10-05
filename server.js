const { doesNotMatch, doesNotReject } = require('assert')
const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Jaewonks:Kk052614..@mall.htg21.mongodb.net/fairnsquare?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
 //원래되던 기능들을 안되게 막아놓은 것(deprecation) 뭔가 에러가 안뜬다고 합니다..
}).then(() => console.log("It's connect to MongoDB well done Jay"))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('hello my first project'))


app.listen(port, () => console.log(`listening on localhost:${port}`))
