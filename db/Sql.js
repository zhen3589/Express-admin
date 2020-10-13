var UserSql = {
    insert: 'INSERT INTO User(id, userName, password) VALUES(?,?,?) ',
    query: "SELECT * FROM user where username='qiaozhenleve@163.com' ",
    getUserById: 'SELECT * FROM user WHERE uid = ? '
};

var GoodsSql = {
    insert: 'INSERT INTO goods(id, wname, imageurl,miaoShaPrice,jdPrice,alreadySoldInfo) VALUES(?,?,?,?,?,?) ',
    query: "SELECT * FROM goods",
    getUserById: 'SELECT * FROM user WHERE uid = ? '
};

// var getGoodsSql = {

// }

module.exports = {
    UserSql,
    GoodsSql
}