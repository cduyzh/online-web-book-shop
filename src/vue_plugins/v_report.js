import notify from '../common_libs/debug_notify'

export default {
    install(Vue) {
        /**
         * 设置report用的指令
         * 使用方法<div v-report-event="{category:1,action:this.openId,label:this.track,value:4}"></div>
         * 使用方法<div v-report-event="[{category:1,action:this.openId,label:this.track,value:4}]"></div>
         */
        Vue.directive('report-event', {
            inserted(el, binding) {
                el.addEventListener('click', () => {
                    if (Array.isArray(binding.value)) {
                        binding.value.forEach(element => {
                            reportEvent(element)
                        })
                    } else {
                        reportEvent(binding.value)
                    }
                })
            }
        })
        Vue.directive('report-error', {
            inserted(el, binding) {
                el.addEventListener('click', reportException(binding.value))
            }
        })
        // 添加实例上的引用 注意：调用的时候track不能为空字符串''，已经发现不能上报到ga上
        // this.$reporter.event({eventName, openId, track, value})
        // this.$reporter.exception({exDescription, exFatal})
        Vue.prototype.$reporter = {event: reportEvent, exception: reportException, reportEnter, reportPageView}
        if (!window.gDevEnv) {
            // 注册onerror事件
            const origOnError = window.onerror ? window.onerror.bind(console) : null
            window.onerror = function onerror(errorMessage, scriptURL, lineNumber) {
                if (origOnError) {
                    origOnError(errorMessage, scriptURL, lineNumber)
                }
                // ga上报异常错误
                reportException({
                    exDescription: `${errorMessage}, @ ${scriptURL}:${lineNumber}`,
                    exFatal: true
                })
            }
            // 捕获'bluebird未捕获的异常'的异常
            window.addEventListener('unhandledrejection', e => {
                const reason = e.detail.reason
                if (!reason || !reason.processed) {
                    reportException({exDescription: `${reason}`, exFatal: true})
                }
            })
        }
    }
}

/**
 * 上报事件名称
 * @param {string} category 事件对象
 * @param {string} action 事件操作
 * @param {string} label 事件分类
 * @param {number} value 与事件相关的数值
 */
function reportEvent({category, action = 'not set', label = 'not set', value = 0}) {
    value = Number(value) || 0
    if (window.gDevEnv && window.gaDev) {
        console.log(category, action, label, value)
        const msg = `事件对象：${category},  事件操作：${action}，  事件分类：${label}`
        notify.toast(msg)
    } else if (window.ga) {
        try {
            ga('send', 'event', category, action, label, value)
        } catch (err) {
            console.error(err)
        }
    }
}

/**
 * 上报异常错误
 * @param {string} exDescription 描述
 * @param {boolean} exFatal 是否严重
 */
function reportException({exDescription, exFatal}) {
    if (window.gDevEnv) {
        console.log(`exDescription: ${exDescription}, exFatal: ${exFatal}`)
    } else if (window.ga) {
        try {
            ga('send', 'exception', {exDescription, exFatal})
        } catch (err) {
            console.error(err)
        }
    }
}

/**
 * 上报页面进入统计（去掉路径后面？参数的统计）
 * @param {string} action 事件操作
 * @param {string} label 事件分类
 * @param {number} value 与事件相关的数值
 */
function reportEnter({action, label}) {
    let url = `${window.location.pathname}${window.location.hash}`
    url = url.replace(/\?.*/, '')
    reportEvent({category: url, action, label})
}

/**
 * 上报页面进入统计
 * @param {string} path 页面路径
 */
function reportPageView({path}) {
    if (window.gDevEnv) {
        console.log('path', path)
    } else if (window.ga) {
        try {
            ga('set', 'page', path)
            ga('send', 'pageview')
        } catch (err) {
            console.error(new ReferenceError('ga initialize error'))
        }
    }
}
