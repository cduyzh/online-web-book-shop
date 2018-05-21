/**
 * Created by lnk on 2016/4/19.
 */
import axios from 'axios'
import Qs from 'qs'
import errorCode from './error_code'
// import debugNotify from './debug_notify'

const httpRequestor = {
    // 默认的异常处理方法，会传入完整的data对象，可以在这里弹提示框
    defaultErrorHandler: null,
    baseURL: gBaseUrl,
    // 跨域请求时把cookie带过去
    withCredentials: false,
    // 是否屏蔽连续的post请求
    preventFastPost: false
}
// 后端默认超时时间必须比这里短
const DEFAULT_TIME_OUT = 35000
// 上传文件的默认超时时间
const DEFAULT_UPLOAD_TIME_OUT = 120000

const axiosInstance = axios.create({
    baseURL: httpRequestor.baseURL,
    timeout: DEFAULT_TIME_OUT
    // headers: {'X-Custom-Header': 'foobar'}
})
axiosInstance.interceptors.response.use(handleResponseSuccess, handleResponseFail)

// 记录正在发送中的请求，以判断是否重复发包的工具
const urlRecorder = {
    // 正在发送中的请求url列表
    urlList: [],

    /**
     * 添加一个正在发送的请求记录，如果已经存在发送中的请求了，就抛出异常
     * @param {string} config
     * @param {string} config.method 请求方法，取值为'GET'和'POST'
     * @param {string} config.url 请求地址
     * @return {Promise}
     */
    add(config) {
        // 只拦截重复发送的POST请求。因为模块化拆分后，经常会在不同组件中发同一个GET请求，特别是跳转页面时，可能导致一些逻辑被跳过
        // 而且GET请求的参数部分不在config.url上，需要自己序列化后拼接上去，否则切换学员列表tab（除allocateState以外的字段全都相同）的场景就很容易被误伤了
        // 而POST一般会修改后端数据，在这种场景拦截更有必要
        if (httpRequestor.preventFastPost && config.method.toUpperCase() === 'POST') {
            // 去掉addVersionToUrl方法加上的时间戳后缀
            let url = config.url.replace(/[&?]_=\d+/, '')
            if (!url.includes('//')) {
                url = httpRequestor.baseURL + url
            }
            if (this.urlList.includes(url)) {
                const code = errorCode.DUPLICATE_REQUEST
                const error = new Error(errorCode.getCodeData(code).message)
                error.code = code
                error.debugMessage = url
                return handleError(config, error)
            }
            this.urlList.push(url)
        }
        return Promise.resolve()
    },
    /**
     * 删除一个正在发送的请求记录
     * @param {string} config
     * @param {string} config.method 请求方法，取值为'GET'和'POST'
     * @param {string} config.url 请求地址
     */
    remove(config) {
        if (httpRequestor.preventFastPost && config.method.toUpperCase() === 'POST') {
            // 去掉addVersionToUrl方法加上的时间戳后缀
            const url = config.url.replace(/[&?]_=\d+/, '')
            const index = this.urlList.indexOf(url)
            if (index >= 0) {
                this.urlList.splice(index, 1)
            } else {
                console.error(`The url [${url}] is not found in urlRecorder`, this.urlList)
            }
        }
    }
}

/**
 * 在url后面加个随机参数，以防浏览器缓存请求
 * @param {string} url
 * @return {string}
 */
function addVersionToUrl(url) {
    return url.includes('?') ? `${url}&_=${Date.now()}` : `${url}?_=${Date.now()}`
}

/**
 * 通过post发送数据，使后端直接收到json格式的数据。并统一处理常见的错误
 * @param {string} url
 * @param {object?} data={}
 * @param {object?} specailCodes 指定一些有特殊行为的错误码。key是错误码，value是取值为errorCode.SPECIAL_CODE_FLAG
 * @param {int?} timeout 超时时间，默认10秒
 * @param {boolean?} withCredentials 是否在跨域请求时把cookie带过去
 * @return {Promise} 返回一个promise对象。其中then方法传递回包中的data数据；catch事件则传递整个回包，其参数为{data:{},status{code:123,message:'xxx'}}
 */
httpRequestor.post = function postJson(url, data = {}, {specailCodes, timeout, withCredentials} = {}) {
    return commonAjax({
        method: 'POST',
        url,
        // data,
        data: Qs.stringify(data),
        specailCodes: specailCodes || {},
        timeout: timeout || DEFAULT_TIME_OUT,
        withCredentials: withCredentials !== undefined ? withCredentials : httpRequestor.withCredentials,
        headers: {
            // 'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded'
            // 'X-Requested-With': 'XMLHttpRequest'
        }
    })
}

/**
 * 通过表单发送同步的post请求，服务器端可以在回包时重定向或下发文件
 * @param {string} url
 * @param {object?} data={} 要发送数据的键值对，值不可以是对象，必须序列化成字符串
 */
httpRequestor.postAndDownload = function postJsonSync(url, data = {}) {
    const postForm = document.createElement('form') // 表单对象
    postForm.method = 'POST'
    postForm.action = addVersionToUrl(httpRequestor.baseURL + url)
    // postForm.enctype = 'application/json';
    Object.entries(data).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.setAttribute('type', 'hidden')
        input.setAttribute('name', key)
        input.setAttribute('value', typeof value === 'object' ? JSON.stringify(value) : String(value))
        postForm.appendChild(input)
    })
    document.body.appendChild(postForm)
    postForm.submit()
    document.body.removeChild(postForm)
}

/**
 * 通过表单post上传文件并接收json格式的数据。并统一处理常见的错误
 * @param {string} url
 * @param {FormData|object} formElem FormData对象，或form Dom元素，其中需要含有一个name为files的选择文件的input元素
 * @param {Function?} onUploadProgress 上传进度回调，参数为event
 * @param {object?} specailCodes 指定一些有特殊行为的错误码。key是错误码，value是取值为errorCode.SPECIAL_CODE_FLAG
 * @param {int?} timeout 超时时间，默认10秒
 * @param {boolean?} withCredentials 是否在跨域请求时把cookie带过去
 * @return {Promise} 返回一个promise对象。其中then方法传递回包中的data数据；catch事件则传递整个回包，其参数为{data:{},status{code:123,message:'xxx'}}
 */
httpRequestor.uploadFile = function uploadFile(url, formElem, onUploadProgress, {specailCodes, timeout, withCredentials} = {}) {
    // $(formElem).attr('enctype', 'multipart/form-data');
    return commonAjax({
        method: 'POST',
        url,
        data: formElem instanceof FormData ? formElem : new FormData(formElem),
        onUploadProgress,
        specailCodes: specailCodes || {},
        timeout: timeout || DEFAULT_UPLOAD_TIME_OUT,
        withCredentials: withCredentials !== undefined ? withCredentials : httpRequestor.withCredentials
    })
}

/**
 * 通过get发送并接收json格式的数据（get发的本来就是json格式）。并统一处理常见的错误
 * @param {string} url
 * @param {object?} params={}
 * @param {object?} specailCodes 指定一些有特殊行为的错误码。key是错误码，value是取值为errorCode.SPECIAL_CODE_FLAG
 * @param {int?} timeout 超时时间，默认10秒
 * @param {boolean?} withCredentials 是否在跨域请求时把cookie带过去
 * @return {Promise} 返回一个promise对象。其中then方法传递回包中的data数据；catch事件则传递整个回包，其参数为{data:{},status{code:123,message:'xxx'}}
 */
httpRequestor.get = function get(url, params = {}, {specailCodes, timeout, withCredentials} = {}) {
    return commonAjax({
        method: 'GET',
        url,
        params,
        specailCodes: specailCodes || {},
        timeout: timeout || DEFAULT_TIME_OUT,
        withCredentials: withCredentials !== undefined ? withCredentials : httpRequestor.withCredentials,
        headers: {
            // 'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded'
            // 'X-Requested-With': 'XMLHttpRequest'
        }
    })
}

/**
 * 通用的发包和回包处理逻辑。会将成功获取到的带有错误码的数据转换为异常通过catch返回出来，并会将所有error对象封装成统一的形式
 * @param config
 * @return {Promise} 返回一个promise对象。其中then方法传递回包中的data数据；catch事件则传递整个回包，其参数为{data:{},status{code:123,message:'xxx'}}
 */
async function commonAjax(config) {
    await urlRecorder.add(config)

    config.url = addVersionToUrl(config.url)
    return axiosInstance(config)
}

/**
 * 统一各版本协议的回包格式
 * @param {object} result
 * @return {{data: *, code: number, message: string?, debugMessage: string?}}
 */
function convertResponseData(result) {
    if (result.status) {
        // 会众版协议返回格式为{data:{}, status:{code:0, message:'xx', debugMessage:'xx'}}
        return {
            data: result.data,
            code: (result.status && result.status.code) || 0,
            message: result.status && result.status.message,
            debugMessage: result.status && result.status.debugMessage
        }
    }
    if (typeof result.code === 'number') {
        // 灵悦版老版本返回格式用{data:{}, code:0, msg:'xx', debugmsg:'xx'}
        return {
            data: result.data,
            code: result.code,
            message: result.msg,
            debugMessage: result.debugmsg
        }
    }
    if (typeof result.retcode === 'number') {
        // 灵悦版更老版本返回格式用{data1:'xx', data2:'xx', retcode:0}
        return {
            data: result,
            code: result.retcode,
            message: '',
            debugMessage: ''
        }
    }
    // 老版本协议或第三方下发的数据，只有data
    return {
        data: result,
        code: 0
    }
}

/**
 * 对成功返回的请求回包进行数据预处理
 * @param response
 * @returns {Promise}
 */
function handleResponseSuccess(response) {
    urlRecorder.remove(response.config)
    if (!response.data.status && typeof response.data.code !== 'number') {
        // 老版本协议下发的数据，只有data
        console.warn('Old version of protocol.', response.config.url)
    }
    const result = convertResponseData(response.data)
    if (result.code === 0) {
        return result.data
    }
    result.message = result.message || errorCode.getCodeData(result.code).message
    return handleError(response.config, result)
}

/**
 * 对发送失败的请求进行数据预处理，将error对象封装为统一的形式
 * @param error
 * @returns {Promise}
 */
function handleResponseFail(error) {
    urlRecorder.remove(error.config)
    let result
    if (error.response) {
        // 请求已发送，响应中返回了非2xx的错误码，包括304等
        const codeMap = {
            401: errorCode.HTTP_UNAUTHORIZED,
            403: errorCode.HTTP_FORBIDDEN,
            404: errorCode.HTTP_NOT_FOUND
        }
        const code = codeMap[error.response.status] || errorCode.HTTP_NETWORK_ERR
        const responseData = convertResponseData(error.response.data)
        result = fillErrorMessage(code, `${error.response.status} ${error.response.statusText}`, responseData)
    } else if (error.message.startsWith('timeout of ')) {
        // 请求没有发出去，本地产生的错误
        result = fillErrorMessage(errorCode.HTTP_TIME_OUT, 'no response')
    } else if (!error.config.url.startsWith(window.location.origin) && error instanceof Error) {
        error.code = errorCode.HTTP_CROSS_DOMAIN
        error.debugMessage = `Can not access from ${window.location.origin}!`
        error.message = errorCode.getCodeData(errorCode.HTTP_CROSS_DOMAIN).message
        result = error
    } else if (error instanceof Error) {
        error.code = errorCode.HTTP_NETWORK_ERR
        error.debugMessage = error.message
        error.message = errorCode.getCodeData(errorCode.HTTP_NETWORK_ERR).message
        result = error
    } else {
        result = fillErrorMessage(errorCode.HTTP_NETWORK_ERR, error.message)
    }
    return handleError(error.config, result)
}

/**
 * 根据错误码生成标准格式的错误信息对象
 * @param {number} code 定义在errorCode中的错误码
 * @param {string?} debugMessage 调试用的错误信息
 * @param {*?} data 请求回包中的数据
 * @returns {{data: null, code: number, message: string, debugMessage: string}}
 */
function fillErrorMessage(code, debugMessage, data = null) {
    return {
        data,
        code,
        message: errorCode.getCodeData(code).message,
        debugMessage
    }
}

/**
 * 统一的异常对象封装逻辑，在这里抛出异常
 * @param {object} requestConfig 发请求时传入axios的配置信息对象
 * @param {object|Error} result 请求回包对象，或异常信息
 * @param {object} result.data
 * @param {number} result.code
 * @param {string} result.message
 * @param {string} result.debugMessage
 * @returns {Promise}
 */
function handleError(requestConfig, result) {
    // 必须是Error对象，否则throw时vuex要报warning
    let err
    if (result instanceof Error) {
        err = result
    } else {
        err = new Error(result.message)
        err.data = result.data
        err.code = result.code
        err.debugMessage = result.debugMessage
    }
    if (requestConfig) {
        err.url = requestConfig.url
    }

    notifyListener(requestConfig, err)
    return Promise.reject(err)
}

/**
 * 通知异常回包监听器，进行一些统一处理
 * @param {object} requestConfig 请求时的config参数
 * @param {Error} err 封装好的异常对象
 */
function notifyListener(requestConfig, err) {
    let flag = requestConfig && requestConfig.specailCodes[err.code]
    if (typeof flag !== 'number') {
        flag = errorCode.SPECIAL_CODE_FLAG.DEFAULT
    }
    // 需要弹出默认toast
    const showToast = (flag & errorCode.SPECIAL_CODE_FLAG.NO_TOAST) === 0
    // 需要弹大红条
    const showWarning = (flag & errorCode.SPECIAL_CODE_FLAG.NO_BANNER) === 0

    if (!window.gDevEnv) {
        console.error(err.message)
    } else if (showWarning) {
        // 测试环境默认弹个大红条
        // debugNotify.showRequestError(err)
        console.log('测试环境不做处理')
    } else {
        // 已经对用户进行展示或已经做了良好处理的错误。如登录失败重定向到登录页，提示登录密码错误等
        console.warn(err.message, err.debugMessage)
    }

    // 默认的错误处理方法，一般是弹toast
    if (httpRequestor.defaultErrorHandler) {
        httpRequestor.defaultErrorHandler(err, showToast)
        err.processed = true
    }
}

export default httpRequestor
