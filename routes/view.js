var express = require('express');
var router = express.Router();
var db = require('../db/db.js')
var connmt = require('../public/js/utlit.js');


// 获取视频列表
router.get('/getViewList', function(req, res) {

    let { pid, type } = req.query;
    let sql = `SELECT * FROM view`;

    db.query(sql, function(err, result) {

        if (!err) {

            result.forEach(item => {
                item['releaseTime'] = connmt.FormatTime('yyyy-MM-dd hh:mm:ss', item.releaseTime)
            });
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

module.exports = router;