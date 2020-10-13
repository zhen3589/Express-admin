var express = require('express');
var router = express.Router();
var settoken = require('../token_vertify.js');
var db = require('../db/db.js')

// 生成token

router.post('/admin', function (req, res, next) {

    let { username, password } = req.body;
    console.log(username);

    let sql = `SELECT id,username,password,realName FROM admin_user WHERE username='${username}'`;

    db.query(sql, function (err, result) {
        if (!err) {

            if (result.length > 0) {
                if (password == result[0].password) {
                    settoken.setToken(username, result[0].id).then((data) => {
                        return res.json({
                            code: 200,
                            token: data,
                            user: {
                                id:result[0].id,
                                username:result[0].username,
                                realName:result[0].realName
                            }
                        });
                    })
                } else {
                    res.json({
                        code: 404,
                        msg: '用户密码错误'
                    })
                }
            } else {
                res.json({
                    code: 404,
                    msg: '该用户不存在'
                })
            }


        } else {
            res.json({
                code: 404,
                msg: '网络异常，稍后再试'
            })
        }
    })
});

module.exports = router;