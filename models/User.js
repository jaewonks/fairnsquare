const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
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
        minglength: 5
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
    tokenExp: { //토큰 유효기간
        type: Number
    }
})

userSchema.pre('save', function( next ) {
        const user = this;
    
    if(user.isModified('password')){    
        // console.log('password changed')
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash 
                next()
            })
        })
    } else {
        next()
    }
});

userSchema.methods.comparePassword = function(plainPassword,callback){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return callback(err);
        callback(null, isMatch)
    })
}

userSchema.methods.generateToken = function(callback) {
    const user = this;
    console.log('user',user)
    console.log('userSchema', userSchema)
    const token =  jwt.sign(user._id.toHexString(),'userToken')

    user.token = token;
    user.save(function (err, user){
        if(err) return callback(err)
        callback(null, user);
    })
}

//스키마를 모델로 감싸준다.
const User = mongoose.model('User', userSchema)

//다른 곳에서도 사용 가능하도록 export
module.exports = { User }
