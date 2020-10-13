var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var vertoken = require('./token_vertify.js');
var expressJwt = require('express-jwt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

var app = express();


app.all('*', function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");//项目上线后改成页面的地址

    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");

    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

    next();

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// / 解析token获取用户信息
// app.use(function (req, res, next) {
//     var token = req.headers['token'];
//     console.log(token == undefined);
//     if (token == undefined) {
//         return next();
//     } else {

//         console.log(token);
//         console.log('---------------------');
//         vertoken.verToken(token).then((data) => {
//             console.log('+++++++++++++=');
//             console.log(data);
//             req.data = data;
//             return next();
//         }).catch((error) => {
//             return next();
//         })
//     }
// });

//验证token是否过期并规定哪些路由不用验证
// app.use(expressJwt({
//     secret: 'mes_qdhd_mobile_xhykjyxgs',
//     algorithms: ['HS256']
// }).unless({
//     path: [
//         '/',
//         '/login/admin',
//         '/users',
//         '/users/adduser',
//         '/userdelete'
//     ]//除了这个地址，其他的URL都需要验证
// }));

const cors = require('cors');  
app.use(cors({  
    origin:['http://localhost:8080','http://127.0.0.1:3000'],
    methods:['GET','POST','DELETE'],
}));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);

//当token失效返回提示信息
// app.use(function (err, req, res, next) {

//     console.log(err.status);
//     if (err.status == 401) {
//         return res.status(401).json({
//             code:401,
//             msg:'token过期'
//         });
//     }
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});




// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
