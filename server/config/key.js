const { modelNames } = require('mongoose');

//환경변수 process.env.NODE_ENV
if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}