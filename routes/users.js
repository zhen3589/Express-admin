var express = require('express');
var router = express.Router();
var db = require('../db/db.js')
var uuid = require('node-uuid');
var connmt = require('../public/js/utlit.js');
const { CodeToText, TextToCode } = require('element-china-area-data/dist/app.commonjs')

console.log(connmt.getDate().items);



/* 获取用户列表 */
router.get('/', function(req, res, next) {

            let { count, page, phone, area } = req.query;
            //查
            let start = 0;
            if (page > 1) {
                start = (page - 1) * count; //页码减去1，乘以条数就得到分页的起始数了
            }

            console.log();
            let area_id = ''

            if (area != '') {
                let strArea = JSON.parse(area);

                console.log(strArea[strArea.length - 1]);
                if (strArea[strArea.length - 1] == '') {
                    area_id = strArea[strArea.length - 2]
                } else {
                    area_id = strArea[strArea.length - 1]
                }
            }


            let totle = `SELECT COUNT(1) AS total FROM users WHERE ${area_id == undefined ? '' : `area LIKE '%${area_id}%' AND`} ${phone == '' ? '1' : 'phone=' + phone}`
    let sql = `SELECT * FROM users WHERE ${area_id == undefined ? '' : `area LIKE '%${area_id}%' AND`} ${phone == '' ? '1' : 'phone=' + phone} LIMIT ${start},${count}`;

    console.log(totle);


    // 查询列表数据
    db.query(sql, function (err, result) {


        // 查询列表长度
        db.query(totle, function (r_err, t_result) {

            if (!err && !r_err) {

                let areaList = new Array();
                result.forEach(item => {
                    item['birthday'] = connmt.FormatTime('yyyy-MM-dd hh:mm:ss', item.birthday)
                    item['registeredDate'] = connmt.FormatTime('yyyy-MM-dd hh:mm:ss', item.registeredDate)
                });

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
    let { name, phone, email, area, head_img, birthday, introduce, realName, position, industry, company, record } = req.body;
    if (birthday == '') birthday = '2000-01-01'

    let stringArea = JSON.parse(area);
    let areaName = CodeToText[stringArea[0]] + '/' + CodeToText[stringArea[1]] + '/' + CodeToText[stringArea[2]];

    let phoneSql = `SELECT phone FROM users` // 查询手机号
    db.query(phoneSql, function (err_phone, result_phone) {
        if (!err_phone) {
            let phones = [];
            for (let i in result_phone) {
                phones.push(result_phone[i].phone)
            }
            if (phones.indexOf(phone) !== -1) {
                res.json({
                    code: 405,
                    msg: '手机号已存在'
                })
            } else {
                let sql = `INSERT INTO users (id,name, phone,area,areaName, email, head_img, birthday, introduce, realName, position, industry, company, record,registeredDate) 
                VALUES 
                ('${uuid.v1()}', '${name}', '${phone}', '${area}','${areaName}', '${email}', '${head_img}', '${birthday}', '${introduce}', '${realName}', '${position}', '${industry}', '${company}', '${record}' ,'${connmt.getDate().items}')`

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
            }


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

// 获取用户信息
router.get('/getUserInformation/:id', function (req, res) {
    let id = req.params.id;

    console.log(id);
    let sql = `SELECT * FROM users WHERE id=${id}`;

    db.query(sql, function (err, result) {
        if (!err) {

            result[0]['birthday'] = connmt.FormatTime('yyyy-MM-dd', result[0].birthday)
            result[0]['registeredDate'] = connmt.FormatTime('yyyy-MM-dd hh:mm:ss', result[0].registeredDate)
            res.json({
                code: 200,
                data: result[0],
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

// 编辑用户
router.post('/edituser', function (req, res) {


    let { id, name, phone, area, email, head_img, birthday, introduce, realName, position, industry, company, record } = req.body;
    if (birthday == '') birthday = '2000-01-01'

    let stringArea = JSON.parse(area);
    let areaName = CodeToText[stringArea[0]] + '/' + CodeToText[stringArea[1]] + '/' + CodeToText[stringArea[2]];

    let sql = `UPDATE users 
    SET name='${name}',phone='${phone}',areaName='${areaName}',area='${area}',email='${email}',head_img='${head_img}',introduce='${introduce}',realName='${realName}',position='${position}',industry='${industry}',company='${company}',record='${record}'
    WHERE id=${id};`

    db.query(sql, function (err, result) {
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

// 初始化用户密码
router.get('/initialization/:id', function (req, res) {
    let id = req.params.id;

    console.log('10');
    console.log(id);

    let sql = `UPDATE users SET password='123456' WHERE id="${id}"`;

    db.query(sql, function (err, result) {
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