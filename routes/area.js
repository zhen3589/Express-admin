var express = require('express');
var router = express.Router();
var db = require('../db/db.js')
var connmt = require('../public/js/utlit.js');

router.get('/', function(req, res) {

    let { pid, type } = req.query;
    let sql = `SELECT * FROM area WHERE pid='${pid}'`;

    db.query(sql, function(err, result) {

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

module.exports = router;