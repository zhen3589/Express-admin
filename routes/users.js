var express = require('express');
var router = express.Router();
var db = require('../db/db.js')
var uuid = require('node-uuid');
var connmt = require('../public/js/utlit.js');

console.log(connmt.getDate().items);

/* 获取用户列表 */
router.get('/', function (req, res, next) {

    let { count, page, phone } = req.query;
    //查
    let start = 0;
    if (page > 1) {
        start = (page - 1) * count; //页码减去1，乘以条数就得到分页的起始数了
    }
    let totle = `SELECT COUNT(1) AS total FROM users WHERE ${phone == '' ? '1' : 'phone=' + phone}`
    let sql = `SELECT * FROM users WHERE ${phone == '' ? '1' : 'phone=' + phone} LIMIT ${start},${count}`;

    console.log(totle);


    let useridd = uuid.v1()

    function rTime(date) {
        var json_date = new Date(date).toJSON();
        return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    }

    // 查询列表数据
    db.query(sql, function (err, result) {

        // 查询列表长度
        db.query(totle, function (r_err, t_result) {

            console.log(t_result);
            if (!err && !r_err) {

                console.log('12' + rTime(result.registeredDate));
                result.registeredDate = rTime(result.registeredDate)
                res.json({
                    code: 200,
                    data: {
                        list: result,
                        total: t_result[0].total
                    },
                    msg: '成功'
                })
            } else {
                res.json({
                    code: 405,
                    msg: '网络不稳定，稍后再试',
                    err
                })
            }
        })

    })
});



// 添加用户
router.post('/adduser', function (req, res, next) {
    let { name, phone, email, head_img, birthday, introduce, realName, position, industry, company, record } = req.body;
    let sql = `INSERT INTO users (id,name, phone, email, head_img, birthday, introduce, realName, position, industry, company, record,registeredDate) 
    VALUES 
    (${new Date().getTime()}, '${name}', '${phone}', '${email}', '${head_img}', '${birthday}', '${introduce}', '${realName}', '${position}', '${industry}', '${company}', '${record}' ,'${connmt.getDate().items}')`


    console.log(sql);
    db.query(sql, function (err, result) {
        console.log(result);
        if (!err) {
            res.json({
                code: 200,
                msg: '成功'
            })
        } else {
            res.json({
                code: 405,
                msg: err.sqlMessage
            })
        }
    })
})

// 删除用户
router.delete('/userdelete/:id', function (req, res) {
    let id = req.params.id;
    let sql = `DELETE FROM users WHERE id='${id}'`
    db.query(sql, function (err) {
        if (!err) {
            res.json({
                code: 200,
                msg: '成功'
            })
        } else {
            res.json({
                code: 405,
                msg: err.sqlMessage
            })
        }
    })


})

module.exports = router;
