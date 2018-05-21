/**
 * Created by lnk on 2016/7/22.
 */

function handleAllErrors() {
    if (window.INIT_DEBUG_NOTIFY) {
        return
    }
    window.INIT_DEBUG_NOTIFY = true

    // 捕获未处理的异常
    window.onerror = function onerror(errorMessage, scriptURL, lineNumber) {
        errorMessage = `${errorMessage}`.replace(/</g, '&lt;').replace(/\n/g, '<br>')
        const detail = scriptURL
            ? `<span style="float:right; padding-right:10px; width: 100%; word-wrap: break-word; ">${scriptURL}:${lineNumber}</span>`
            : ''
        notification('alert', `<span>${errorMessage}</span>${detail}`)
    }

    // const origConsoleError = console.error.bind(console)
    // 把控制台的错误日志输出到大红条上
    // console.error = (...args) => {
    //     origConsoleError(...args)
    //     // TODO iView的组件在Vue2.5.10+版本中报warning了。暂时屏蔽掉大红条
    //     if (typeof args[0] === 'string' && args[0].includes('Do not use built-in or reserved HTML elements as component id:')) {
    //         return
    //     }
    //     notification('alert', `<span>${errorArgsToString(args)}</span>`)
    // }

    // 捕获'未捕获的Promise异常'的异常
    window.addEventListener('unhandledrejection', e => {
        // bluebird会将抛出的异常放进detail对象中
        const reason = e.reason || (e.detail && e.detail.reason)
        // const promise = e.detail.promise;
        if (reason && reason.processed) {
            // 该错误已经处理过了。调用e.preventDefault()阻止控制台打印错误堆栈
            e.preventDefault()
        } else {
            notification('alert', `<span>Unhandled rejection ${reason && reason.toString()}</span>`)
        }
    })
}

/**
 * 序列化console.error的参数
 * @param {Array} args
 * @returns {string}
 */
// function errorArgsToString(args) {
//     return args
//         .map(arg => {
//             if (typeof arg !== 'object') {
//                 return String(arg)
//             } else if (arg instanceof Error) {
//                 return arg.toString()
//             } else if (arg.message) {
//                 // 一些自定义的Error类型
//                 return `${arg} ${arg.message}`
//             } else {
//                 return JSON.stringify(arg)
//             }
//         })
//         .map(arg => arg.replace(/</g, '&lt;'))
//         .join('<br>')
//         .replace(/\n/g, '<br>')
// }

// 请求失败
function showRequestError(err) {
    // 去掉两层“From previous even”，定位到发请求的代码
    console.warn(err.stack.toString().replace(/(.*?\n)[\w\W]*?From previous event:\n[\w\W]*?From previous event:\n(.*)/, '$1$2'))
    const url = (err.url || '').replace(/[?&]_=\d+/, '')
    notification(
        'alert',
        [
            `<span class="http-code">${err.code}</span>`,
            `<span>${err.message}</span>`,
            `<span class="http-url">${url}</span>`,
            '<br/>',
            `<p class="http-stack">${err.debugMessage.replace(/\\n/g, '<br>')}</p>`
        ].join('')
    )
}

/**
 * 打印普通日志
 * @param {string} msg
 * @param {number,optional} duration 提示条显示的时间
 */
function showInfo(msg, duration) {
    console.log(msg)
    notification('info', `<p class="info">${msg.replace(/</g, '&#60;').replace(/\n/g, '<br>')}</p>`, duration)
}

/**
 * 打印普通日志，一定时间后消失
 * @param {string} msg
 */
function toast(msg) {
    showInfo(`${msg}`, 10000)
}

// 加载资源失败
function loadFailed(event) {
    const src = event.target.src
    const errInfo = new Error().stack.split('\n')[2]
    let errLine = ''
    if (errInfo) {
        const matches = errInfo.match(/^.*?\((.+?):(\d+)(:\d+)?\).*$/)
        if (matches.length > 1) {
            let url = matches[1],
                lineNum
            if (matches.length > 2) {
                lineNum = matches[2]
                url += `:${lineNum}`
            }
            console.warn(`load ${src} failed.\nat ${url}`)
            errLine = `<br>at html: ${lineNum}`
        }
    }
    notification('alert', `load ${src} failed.${errLine}`)
}

/**
 * 弹出foundation样式的alert条
 * @param  {string} type     类型，取值为success,alert,warning,info
 * @param  {string} text     内容文字
 * @param  {number, optional} duration 显示多久后消失，不填表示不消失
 */
function notification(type, text, duration) {
    if (!window.gDevEnv) {
        return
    }
    let $alertArea = document.querySelector('#alert-area')
    if (!$alertArea) {
        init()
        $alertArea = document.createElement('div')
        $alertArea.id = 'alert-area'
        document.body.appendChild($alertArea)
    }
    const $alert = document.createElement('div')
    $alert.className = `alert-box ${type}`
    $alert.innerHTML = `${text}<span class="close">&times;</span>`
    $alertArea.appendChild($alert)
    $alert.querySelector('.close').addEventListener('click', close)
    if (duration) {
        setTimeout(close, duration)
    }

    function close() {
        $alert.remove()
    }

    function init() {
        const alertCss = `
#alert-area {
  z-index: 1000000000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  text-align: left;
}

.alert-box {
  display: block;
  font-size: 14px;
  font-weight: normal;
  float: left;
  width: 100%;
  word-break: break-all;
  margin-bottom: 5px;
  padding: 10px 40px 10px 18px;
  position: relative;
  transition: opacity 300ms ease-out;
  background-color: #008CBA;
  color: #FFF;
  box-sizing: border-box;
  border-width: 0;
  border-radius: 0
}

.alert-box .close {
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.5);
  color: #333333;
  font-size: 32px;
  font-weight: normal;
  text-shadow: 0 0 0;
  opacity: 0.3;
  position: absolute;
  cursor: pointer;
}

.alert-box .close:hover {
  opacity: 0.6;
}

.alert-box.success {
  background-color: rgba(67, 172, 106, 0.8);
}

.alert-box.alert {
  background-color: rgba(240, 65, 36, 0.8);
}

.alert-box.warning {
  background-color: rgba(240, 138, 36, 0.8);
}

.alert-box.info {
  background-color: rgb(45, 140, 240);
  color: #fff;
}

.http-code {
  margin-right: 8px;
}

.http-url {
  float: right;
  margin-right: 16px;
}

@media (min-width: 768px) {
  .http-code {
    float: left;
    height: 40px;
  }

  .http-stack {
    float: left;
    font-size: 150%;
  }
}`
        const styleElem = document.createElement('style')
        styleElem.innerHTML = alertCss
        document.head.appendChild(styleElem)
    }
}

if (window.gDevEnv) {
    // 加载大红条，捕获未处理的异常
    handleAllErrors()
}

export default {
    showInfo,
    showRequestError,
    loadFailed,
    toast
}
