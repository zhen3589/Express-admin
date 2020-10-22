var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var vertoken = require('./token_vertify.js');
var expressJwt = require('express-jwt');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var viewRouter = require('./routes/view');
var uploadFileRouter = require('./routes/uploadFile');
var video_classRouter = require('./routes/video_class');
const jwtUnless = require('./jwt_unless') //用于判断是否需要jwt验证

var app = express();


app.all('*', function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*"); //项目上线后改成页面的地址

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
app.use(function(req, res, next) {
    var token = req.headers['token'];
    if (token == undefined) {
        return next();
    } else {

        vertoken.verToken(token).then((data) => {
            req.data = data;
            return next();
        }).catch((error) => {
            return next();
        })
    }
});

// 验证token是否过期并规定哪些路由不用验证
app.use(expressJwt({ secret: 'mes_qdhd_mobile_xhykjyxgs', algorithms: ['HS256'] }).unless({
    //自定义过滤函数，详细参考koa-unless
    custom: ctx => {
        if (jwtUnless.checkIsNonTokenApi(ctx)) {
            //是不需要验证token的接口
            return true
        } else {
            //是需要验证token的接口
            return false
        }
    }
}));
// http://127.0.0.1:3000/uploadFile/download/1603260170133-190204084208765161.mp4
const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/view', viewRouter);
app.use('/uploadFile', uploadFileRouter);
app.use('/videoType', video_classRouter);

//当token失效返回提示信息
app.use(function(err, req, res, next) {

    console.log(err.status);
    if (err.status == 401) {
        return res.status(401).json({
            code: 401,
            msg: 'token过期'
        });
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});




// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;