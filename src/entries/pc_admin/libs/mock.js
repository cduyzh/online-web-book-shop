import Mock from 'mockjs'

/**
 * 根据接口地址生成适用于httpRequestor的正则表达式
 * @param {string} api 接口地址，格式如/account/signin或http://xxx.com/account/signin
 * @return {RegExp}
 */
function makeUrlRegExp(api) {
    let url = api.includes('//') ? api : gBaseUrl + api
    url = url.replace('.', '\\.')
    if (url.includes('?')) {
        url = url.replace('?', '\\?')
        url += '&_=.+'
    } else {
        url += '\\?_=.+'
    }
    return new RegExp(url)
}

/**
 * 拦截HttpRequestor发出的请求，并返回假数据。支持正式环境和测试环境
 * @param {string} url 接口地址，格式如/account/signin
 * @param {*} data 要返回的假数据
 */
function mockHttpRequestor(url, data) {
    Mock.mock(makeUrlRegExp(url), data)
}

// 示例数据
mockHttpRequestor('/dataplat/getmoduleinfo', {
    msg: 'success',
    debugmsg: 'success',
    code: 0,
    data: {
        mod_gift: {int_recvgift: '\u63a5\u6536\u7684\u73ab\u7470\u6570', int_sendgift: '\u53d1\u9001\u7684\u73ab\u7470\u6570'},
        mod_fri: {int_match: 'match\u6570', int_pass: 'pass\u6570', int_like: 'like\u6570'},
        mod_visitor: {int_vistor: 'nodesc'},
        mod_msg: {
            int_sendmsg: '\u6d88\u606f\u53d1\u9001\u6570',
            int_sendtmp: '\u4e34\u65f6\u6d88\u606f\u53d1\u9001\u6570',
            int_recvmsg: '\u6d88\u606f\u63a5\u6536\u6570',
            int_recvtmp: '\u4e34\u65f6\u6d88\u606f\u63a5\u6536\u6570'
        },
        mod_remain: {int_active: 'nodesc'}
    }
})
