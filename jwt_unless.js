/**
 * 用于判断客户端当前请求接口是否需要jwt验证
 */

//定义不需要jwt验证的接口数组(get方法)
const nonTokenApiArr = [
    '/',
    '/login/admin'
]

//定义不需要jwt验证的接口正则数组(get方法)
const nonTokenApiRegArr = [
    /^\/uploadFile\/\d/,
    /^\/post\/\d/
    // /uploadFile/download/
]

//判断请求api是否在数组里
const isNonTokenApi = (path) => {
    return nonTokenApiArr.includes(path)
}

//判断请求api是否在正则数组里
const isNonTokenRegApi = (path) => {
    return nonTokenApiRegArr.some(p => {

        console.log(path);
        return (typeof p === 'string' && p === path) ||
            (p instanceof RegExp && !!p.exec(path))
    });
}

//判断当前请求api是否不需要jwt验证
const checkIsNonTokenApi = (ctx) => {

    if ((isNonTokenApi(ctx.path) || isNonTokenRegApi(ctx.path) || ctx.path.substring(0, 25) == '/api/uploadFile/download/' || ctx.path.substring(0, 14) == '/api/home/img/') && ctx.method == 'GET') {
        return true
    } else {
        // 特殊post接口，不需要验证jwt
        if (ctx.path == '/api/login/admin' || ctx.path == '/') {
            return true
        }
        return false
    }
}

module.exports = {
    nonTokenApiArr,
    nonTokenApiRegArr,
    isNonTokenApi,
    isNonTokenRegApi,
    checkIsNonTokenApi
}