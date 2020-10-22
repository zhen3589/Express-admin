const express = require('express');
const router = express.Router();
const db = require('../db/db.js')
const connmt = require('../public/js/utlit.js');
const fs = require('fs');
const path = require('path');


// 获取全部视频类型
router.get('/getAllvideoType', function(req, res) {

    let sql = `SELECT * FROM video_class`;

    db.query(sql, function(err, result) {

        result.forEach(item => {
            item['establishTime'] = connmt.FormatTime('yyyy-MM-dd hh:mm:ss', item.establishTime)
        });

        if (!err) {
            res.json({
                code: 200,
                data: result,
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

// 新增视频类型
router.post('/addVideoType', (req, res) => {
    let name = req.body.name;
    let sql = `INSERT INTO video_class (name,establishTime) VALUES ('${name}','${connmt.getDate().items}')`

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

// 编辑视频类型
router.post('/editVideoType', (req, res) => {
    let { name, id } = req.body;
    let sql = `UPDATE video_class SET name='${name}' WHERE id='${id}'`;

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

// 删除视频类型
router.delete('/deleteVideoType/:id', (req, res) => {
    let id = req.params.id;
    let file_type = req.query.file_type;
    let sql = `DELETE FROM video_class WHERE id=${id} and file_type='${file_type}'`;

    console.log('81');
    console.log(path.join(__dirname, '1603090310253-190204084208765161.mp4'));

    fs.unlink('uploads/video/1603090363941-big_buck_bunny.mp4', (err) => {
        if (err) throw err;
        console.log('已成功地删除文件');
    });

    // db.query(sql, (err, result) => {
    //     if (!err) {
    //         res.json({
    //             code: 200,
    //             msg: '成功'm
    //         })
    //     } else {
    //         res.json({
    //             code: 200,
    //             msg: '失败'
    //         })
    //     }
    // })
})



module.exports = router;