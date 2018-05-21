import {get as _get} from 'lodash'

/**
 * 提供在所有页面都可以使用的通用的方法
 */
export default {
    trimAll,
    addZero,
    onlyNum,
    closeWin,
    targetSelf,
    loadJs,
    formatStamp,
    isEmptyObject,
    getBrowserVersion,
    getUrlQuery,
    getOffsetTop,
    getOffsetLeft,
    scrollTo,
    isSameArray,
    safeHtml,
    checkParams,
    validateForm,
    /**
     * 访问sessionStorage接口，支持直接读写object。这里的取值表示是否在读取过一次后就删除。用法如下
     * util.sessionStorage.XX_DATA_FOMR_OO_PAGE = 'abc'
     * util.sessionStorage.XX_DATA_FOMR_OO_PAGE = {b:1, c:[234,{d:'ab"cd\'efg'}]}
     * console.log(util.sessionStorage.XX_DATA_FOMR_OO_PAGE)
     */
    sessionStorage: initStorage(sessionStorage, {
        // 当前选中的商品信息
        SELECTED_GOODS_INFO: false,
        // 统计跟踪代码
        TRACK_FROM: false,
        // 邀请码
        PROMO_CODE: false,
    }),
    /**
     * 访问localStorage接口，支持直接读写object。这里的取值表示是否在读取过一次后就删除。用法同sessionStorage
     */
    localStorage: initStorage(localStorage, {
        // XX页面用户输入的草稿内容
        XX_PAGE_DRAFT: false,
    }),
    finishPrerender,
};

/**
 * 初始化storage代理
 * @param {Storage} stub
 * @param {object} propMap
 */
function initStorage(stub, propMap) {
    // PhantomJs预渲染时不支持Proxy
    if (typeof Proxy === 'undefined') {
        return {}
    }
    return new Proxy({}, {
        get(target, key) {
            return getItem(key, propMap[key])
        },
        set(target, key, value) {
            setItem(key, value)
            // 必须返回true或抛异常，否则会报错'set' on proxy: trap returned falsish for property 'xxx'
            return true
        }
    })

    function getItem(key, isOneshot) {
        const realKey = getRealKey(key)
        let value = stub.getItem(realKey)
        if (value !== undefined) {
            try {
                value = JSON.parse(value)
            } catch (e) {
                if (e.name === 'SyntaxError') {
                    console.error(`can't parse [${realKey}]: ${value}`)
                    removeItem(key)
                } else {
                    console.error(e)
                }
                value = undefined;
            }
            if (isOneshot) {
                removeItem(key)
            }
        }
        return value;
    }

    function setItem(key, value) {
        if (value === undefined) {
            removeItem(key)
            return
        }
        const realKey = getRealKey(key)
        try {
            stub.setItem(realKey, JSON.stringify(value));
        } catch (e) {
            if (e.name === 'QuotaExceededError' && stub.length) {
                // 空间不足
                stub.clear();
                stub.setItem(realKey, JSON.stringify(value))
            } else {
                console.error(e)
            }
        }
    }

    function removeItem(key) {
        const realKey = getRealKey(key)
        try {
            stub.removeItem(realKey)
        } catch (e) {
            console.error(e)
        }
    }

    function getRealKey(key) {
        return `BOOK_STORE_${key}${window.gDevEnv ? '_dev' : ''}`
    }
}

/**
 * 删除所有空格
 * @param {string} str
 * @return {string}
 */
export function trimAll(str) {
    return str.replace(/\s/g, '')
}

/**
 * 小于10，补0函数，常用于时间结构
 * @param {number} num
 * @return {string}
 */
export function addZero(num) {
    return num < 10 ? `0${num}` : num
}

/**
 * 去除非数字字符
 * @param {string} str
 * @return {string}
 */
export function onlyNum(str) {
    return str ? str.replace(/\D/ig, '') : str
}

/**
 * 关闭当前标签页
 */
export function closeWin() {
    window.opener = null
    window.open('', '_self')
    window.close()
}

/**
 * 在当前页面跳转，external是否为外部域名
 * @param {string} url
 * @param {boolean?} external
 */
export function targetSelf(url, external = false) {
    if (external) {
        window.top.location.href = url
    } else {
        window.top.location.href = `${window.location.protocol}//${window.location.host}${url}`
    }
}

/**
 * 异步加载js，并返回promise
 * @param {string} url 所要加载的xx.js。不用require是因为一些压缩过的三方库，引入webpack打包流程会拖慢打包速度
 * @param {string} importedObjName 是否已经加载xx.js的方法名或对象或参数
 * @param {string?} id script标签的id，防止重复加载。不填则允许重复加载
 * @param {number=30000} timeout 加载超时时间
 * @returns {Promise}
 */
export function loadJs(url, importedObjName, id, timeout = 30000) {
    if (window[importedObjName]) {
        return Promise.resolve(window[importedObjName], false);
    }
    const jsId = id || `${randomString(8)}-js`;
    const INTERVAL = 100
    const notLoadBefore = !document.getElementById(jsId);
    return new Promise((resolve, reject) => {
        let newElem = null
        // 加载经过的时间
        let total = 0
        let timer = null
        if (notLoadBefore) {
            newElem = document.createElement('script');
            newElem.id = jsId;
            newElem.src = url;
            newElem.onerror = () => callReject(new Error(`Load ${url} failed`))
            document.getElementsByTagName('head')[0].appendChild(newElem);
        }
        if (window[importedObjName]) {
            callResolve()
            return
        }
        timer = setInterval(() => {
            total += INTERVAL
            if (total > timeout) {
                // 注意超时后我们把原script标签移除掉了。但是还是有可能加载成功并执行原script
                callReject(new Error(`Load ${url} timeout`))
            } else if (window[importedObjName]) {
                callResolve()
            }
        }, INTERVAL);

        function callResolve() {
            console.log(importedObjName, 'loaded')
            if (timer) {
                clearInterval(timer)
            }
            // 第二个参数表示是否是首次加载完毕，可以依据此做一些初始化工作
            resolve(window[importedObjName], !!newElem);
        }

        function callReject(err) {
            if (timer) {
                clearInterval(timer)
            }
            // 移除掉当前元素，这样才能重试加载
            if (newElem) {
                newElem.remove()
            }
            reject(err)
        }
    });
}

/**
 * 生成指定长度的随机字符串序列
 * @param {number?} len
 * @returns {string}
 */
function randomString(len = 32) {
    const chars = 'GQM5s7KdZhr8zFV3X4CHfU6kIq2cgTBDnoJamSyNOeYW9Rt01pLblvwiuPExjA';
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

/**
 * 时间戳转世界时间
 * @param {number} time
 * @param {string} format 时间格式字符串 "yyyy-MM-dd EEE hh:mm:ss"
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @return {string}
 * @example
 * "yyyy-MM-dd hh:mm:ss.S" ==> 2006-07-02 08:09:04.423
 * "yyyy-M-d h:m:s.S"      ==> 2006-7-2 8:9:4.18
 */
export function formatStamp(time, format) {
    format = format === null ? 'yyyy/MM/dd hh:mm' : format
    const date = new Date()
    date.setTime(time * 1000)
    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length))
    for (const k in o) {
        if (new RegExp(`(${k})`).test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)))
    }
    return format
}

/**
 * 检测一个对象是否是空对象
 * @param {object} obj
 * @return {boolean}
 */
export function isEmptyObject(obj) {
    for (const key in obj) {
        // 如果obj是Object.create(null)创建出来的，就没有prototype，也没有hasOwnProperty
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

/*
 * 设备检测
 * @return {{isIos:Function, isAndroid:Function}}
 */
export function getBrowserVersion() {
    const ua = navigator.userAgent || navigator.vendor || window.opera
    const uaInfo = {
        ios: /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(ua),
        android: /Android/i.test(ua) || /Linux/i.test(ua)
    }
    return {
        isIos() {
            return uaInfo.ios
        },
        isAndroid() {
            return uaInfo.android
        }
    }
}

/**
 * 获取url中的指定参数
 * @param   {string} name url中的参数名字
 * @param   {string?} url 不填则使用当前地址
 * @returns {null | string} 若获取失败则返回null
 */
export function getUrlQuery(name, url) {
    const matcher = (url || window.location.search).match(`${name}=([^&#]+)`);
    if (!matcher || matcher.length < 2) {
        console.log(`No "${name}" in url`);
        return null;
    }
    return matcher[1];
}

/**
 * 获取指定元素距离网页顶部的距离
 * @param elem
 * @returns {number}
 */
export function getOffsetTop(elem) {
    let top = 0;
    while (elem) {
        top += elem.offsetTop;
        elem = elem.offsetParent;
    }
    return top;
}

/**
 * 获取指定元素距离网页左边的距离
 * @param elem
 * @returns {number}
 */
export function getOffsetLeft(elem) {
    let left = 0;
    while (elem) {
        left += elem.offsetLeft;
        elem = elem.offsetParent;
    }
    return left;
}

/**
 * 滚动到指定的元素
 * @param {string} selector 元素选择器
 */
export function scrollTo(selector) {
    const elem = document.querySelector(selector);
    if (elem) {
        document.body.scrollTop = getOffsetTop(elem) - (document.documentElement.clientHeight - elem.clientHeight) / 2;
    }
}

/**
 * 比较两个数组是否相同
 * @param {Array} array1
 * @param {Array} array2
 * @param {Function} [comparator] 数组元素的比较器，传入参数为两个元素值，返回boolean
 */
export function isSameArray(array1, array2, comparator) {
    if (array1.length !== array2.length) {
        return false
    } else if (!array1.length) {
        return true
    }
    if (comparator) {
        return array1.every(item1 => array2.some(item2 => comparator(item1, item2)))
    } else {
        return array1.every(item => array2.includes(item))
    }
}

/**
 * 对用户输入的字符串进行转义，防止xss攻击。需要用v-html方式显示的用户内容一定要调用此方法
 * @param {string} str
 */
export function safeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/(\r\n|\n)/g, '<br>')
}

/**
 * 检查obj对象的成员类型
 * @param {object} obj 待检查的对象
 * @param {object} paramMaps obj中要检查的成员名和成员类型字符串的映射表。
 *                          类型值为'undefined','number','array'等，末尾加问号表示该参数可选
 * @param {string?} objDisplayName 打印错误日志时用的obj名字
 * @returns {boolean} 是否全部合格
 *
 * @example
 * checkParams(obj, {title:'string', 'school.name':'string', books:'array', 'remark', 'string?'}
 */
export function checkParams(obj, paramMaps, objDisplayName = 'obj') {
    if (obj === undefined) {
        console.error(`${objDisplayName} is undefined`)
        return false
    }
    const allType = ['undefined', 'object', 'boolean', 'number', 'string', 'function', 'symbol', 'array']
    return Object.entries(paramMaps).every(([field, type]) => {
        // 检查type参数
        if (typeof type !== 'string') {
            console.error(`type is ${type}, expect one of ${JSON.stringify(allType)}`)
            return false
        }
        const optional = /\w+\?/.test(type)
        if (optional) {
            type = type.slice(0, -1)
        }
        if (!allType.includes(type.toLowerCase())) {
            console.error(`type is ${type}, expect one of ${JSON.stringify(allType)}`)
            return false
        }
        type = type.toLowerCase()

        // 检查obj中对应属性的取值
        const value = _get(obj, field)
        if (optional && value === undefined) {
            return true
        }
        if (type === 'array') {
            if (!Array.isArray(value)) {
                console.error(`${objDisplayName}.${field} is ${value}, expect a ${type}`)
                return false
            }
        } else if (typeof value !== type) { // eslint-disable-line valid-typeof
            console.error(`${objDisplayName}.${field} is ${value}, expect a ${type}`)
            return false
        }
        return true
    })
}

/** 调用iView组件的表单校验方法，并返回一个Promise
 * @param formComponent
 * @returns {Promise}
 */
export function validateForm(formComponent) {
    return new Promise((resolve, reject) => {
        formComponent.validate((valid) => {
            if (valid) {
                resolve()
            } else {
                const e = new Error('validate form fail')
                e.processed = true
                reject(e)
            }
        })
    })
}

/**
 * 预渲染时通知编译进程结束预渲染用的方法
 * @return {boolean} 是否在预渲染环境中
 */
export function finishPrerender() {
    if (!window.gPrerenderEnv) {
        return false
    }
    const timer = setInterval(() => {
        if (typeof window.gFinishPrerender === 'function') {
            window.gFinishPrerender()
            clearInterval(timer)
        }
    }, 10)
    return true
}

// 验证手机号码
export function isPhoneNum(str) {
    // if (window.gDevEnv) {
    //     // 测试环境00开头跳过手机验证
    //     console.log('测试环境验证手机号')
    //     return /^(\+?86)?(00|1\d)\d{9}$/.test(str);
    // } else {
    //     console.log('正式环境验证手机号')
    //     return /^(\+?86)?1\d{10}$/.test(str);
    // }
    // 支持外国手机号
    return /^\+?\d{7,}$/.test(str)
}
