const { User } = require('../models/User')
let auth = (req, res, next) => {
    //인증 처리를 하는 곳

    //클라이언트 쿠키에서 토큰을 가져온다
    let token = req.cookies.tokenInCookie;
    //토큰을 복호화한 후 유저를 찾는다 //역시 userSchema에 method를 만든다.
    //유저가 있으면 인증 ok
    //유저가 없으면 인증 no
    //console.log(token) 클라이언트 쿠키에 토큰이 있음!
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })
        //server.js auth라우터에서 정보를 가질 수 있다.
        req.token = token;
        req.user = user;
        next() //넥스트가 없으면 server.js 미들웨어에 갇힌다.
    })
}

module.exports = { auth }