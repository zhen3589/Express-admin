var express = require('express');
var router = express.Router();
var db = require('../db/db.js')
var connmt = require('../public/js/utlit.js');
var uuid = require('node-uuid');
const fs = require('fs');


// 获取视频列表
router.get('/getViewList', function(req, res) {

            let { page, count, startTiem, endTiem, state, type } = req.query;

            let start = 0;
            if (page > 1) {
                start = (page - 1) * count; //页码减去1，乘以条数就得到分页的起始数了
            }

            let sql = `SELECT * FROM view WHERE 1=1 
                ${startTiem == undefined || endTiem == undefined ? '' : `and releaseTime >= '${startTiem}' and releaseTime <= '${endTiem}'`}
                ${state == null || state == '' ? '' : `and shelf = '${state}'`}
                ${type == null || type == '' ? 'ORDER BY releaseTime DESC ' : `and type = '${type}'`}
                LIMIT ${start},${count} `;

    let total = `SELECT COUNT(1) AS total FROM view WHERE 1=1 
                ${startTiem == undefined || endTiem == undefined ? '' : `and releaseTime >= '${startTiem}' and releaseTime <= '${endTiem}'`}
                ${type == null || type == '' ? '' : `and type = '${type}'`} 
                ${state == null || state == '' ? '' : `and shelf = '${state}'`}`;

    db.query(sql, function (err, result) {
        db.query(total, function (total_err, total) {
            if (!err && !total_err) {

                result.forEach(item => {
                    item['releaseTime'] = connmt.FormatTime('yyyy-MM-dd hh:mm:ss', item.releaseTime)
                });
                res.json({
                    code: 200,
                    data: result,
                    total: total[0].total,
                    msg: '成功'
                })
            } else {
                res.json({
                    code: 405,
                    msg: '失败'
                })
            }
        })
    })
})

// 添加视频
router.post('/addView', function (req, res) {
    let { title, introduction, coverBase, viewFileUrl, file_type, type } = req.body;
    let sql = `INSERT INTO view (id,title,introduction,coverBase,viewFileUrl,file_type,releaseTime,type) 
    VALUES 
    ('${uuid.v1()}','${title}','${introduction}','${coverBase}','${viewFileUrl}','${file_type}','${connmt.getDate().items}','${type}')`;

    console.log(sql);

    db.query(sql, function (err, result) {

        if (!err) {
            if (!err) {

                res.json({
                    code: 200,
                    msg: '成功'
                })
            } else {
                res.json({
                    code: 405,
                    msg: '失败'
                })
            }
        }

        res.json({
            code: 405,
            msg: sql
        })
    })
})

// 获取视频信息
router.get('/getVideoInformation/:id', (req, res) => {
    let id = req.params.id;

    console.log(id);
    let sql = `SELECT * FROM view WHERE id=${id}`;

    db.query(sql, (err, result) => {
        if (!err) {
            res.json({
                code: 200,
                data: result[0],
                msg: '成功'
            })
        }
    })
})

// 编辑视频信息
router.post('/editVideoInformation', (req, res) => {

    console.log(req.body);
    let { id, title, introduction, coverBase, viewFileUrl, file_type, type } = req.body;
    let sql = `UPDATE view SET title='${title}',introduction='${introduction}',coverBase='${coverBase}',viewFileUrl='${viewFileUrl}',file_type='${file_type}',type='${type}' WHERE id=${id}`

    db.query(sql, (err, result) => {
        if (!err) {
            res.json({
                code: 200,
                msg: '成功'
            })
        } else {
            res.json({
                code: 200,
                msg: '失败'
            })
        }
    })
})

// 停用&&启用
router.post('/isenable', function (req, res) {

    let { id, states } = req.body;

    let sql = `UPDATE view SET shelf="${states}" WHERE id="${id}"`
    db.query(sql, function (err, result) {
        if (!err) {
            res.json({
                code: 200,
                msg: '成功'
            })
        } else {
            res.json({
                code: 405,
                msg: '失败'
            })
        }
    })
})

// 删除视频
router.delete('/deleteVideo/:id', function (req, res) {
    let id = req.params.id;
    let { file_type, viewFileUrl } = req.query;
    let sql = `DELETE FROM view WHERE id='${id}'`;

    db.query(sql, function (err, result) {

        if (!err) {

            if (file_type == '2') {
                fs.unlink('uploads/video/' + viewFileUrl, (err) => {
                    if (err) throw err;
                    res.json({
                        code: 200,
                        msg: '删除成功'
                    })
                });
            } else {
                res.json({
                    code: 200,
                    msg: '删除成功'
                })
            }


        } else {
            res.json({
                code: 405,
                msg: '删除失败'
            })
        }
    })
})

module.exports = router;