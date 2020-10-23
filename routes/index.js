var express = require('express');
var router = express.Router();
const os = require('os');
const fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {

    res.sendFile(__dirname + '/public/dist/index.html')
        //   res.send('服务器启动成功'+getIPAdress() + ':3000')
});

///获取本机ip///
function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

module.exports = router;