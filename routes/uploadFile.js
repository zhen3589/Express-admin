var express = require('express');
var router = express.Router();
var multer = require('multer')
var video_url = '';

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/video')
    },
    filename: function(req, file, cb) {
        let url = Date.now() + '-' + file.originalname;
        console.log(file);
        video_url = url
        cb(null, url)
    }
})
var upload = multer({ storage: storage })

// var upload = multer({ dest: 'uploads/video' })

router.post('/', upload.single('file'), function(req, res) {

    return res.json({
        code: 200,
        msg: '上传成功',
        data: {
            url: `uploadFile/download/${video_url}`
        }
    })
})

router.get('/download/:id', (req, res) => {
    const url = req.params.id;
    return res.download(`uploads/video/${url}`);
})

module.exports = router