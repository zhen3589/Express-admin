var jwt = require('jsonwebtoken');
var signkey = 'mes_qdhd_mobile_xhykjyxgs';

exports.setToken = function(username, userid) {
    console.log(username);
    console.log(userid);
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            name: username,
            user_id: userid
        }, signkey, { expiresIn: '1d' });
        resolve(token);
    })
}

exports.verToken = function(token) {
    return new Promise((resolve, reject) => {
        var info = jwt.verify(token.split(' ')[1], signkey);
        resolve(info);
    })
}