import {get as _get} from 'lodash'
import {getBrowserVersion} from './util'

const browserVersion = getBrowserVersion()

/**
 * 测试接口是否存在,业务不需要根据此判断接口存在，只需要对jumpToVerify等暴露接口判空
 * @param {string} funcName 机型相关的api接口名
 * @param {boolean} isAndroid 是否是安卓机型
 * @return {boolean}
 */
export function testApi(funcName, isAndroid) {
    return !!_get(window, isAndroid ? `android.${funcName}` : `webkit.messageHandlers.${funcName}.postMessage`)
}

/**
 * 调用native接口
 * @param {string} funcName 机型相关的api接口名
 * @param {boolean} isAndroid 是否是安卓机型
 * @param {...*} args 传给api接口的参数列表
 */
function callApi(funcName, isAndroid, ...args) {
    console.log(`call ${isAndroid ? 'Android' : 'iOS'} api: ${funcName} args: ${args}`)
    // iOS接口必须有且仅有一个参数，否则会调用失败。如果业务没传就随便传一个参数进去
    if (!args.length && !isAndroid) {
        args = ['ignore']
    }
    if (args.length > 1 && !isAndroid) {
        console.error('only accept one parameter for ios api')
    }
    try {
        // 这里不能使用提前获取好的函数对象，也不是bind的问题
        if (isAndroid) {
            window.android[funcName](...args)
        } else {
            // iOS只能传入一个参数，多的必须装到数组里
            window.webkit.messageHandlers[funcName].postMessage(args[0])
        }
    } catch (e) {
        console.error(e)
    }
}

/**
 * 快速创建无参数接口
 * @param {string|null} androidFuncName 安卓的方法名，传null表示该平台无对应的接口
 * @param {string|null} iosFuncName ios的方法名，传null表示该平台无对应的接口
 * @return {Function|null}
 */
function createNoArgApi(androidFuncName, iosFuncName) {
    if (browserVersion.isAndroid() && androidFuncName && testApi(androidFuncName, true)) {
        return () => callApi(androidFuncName, true)
    }
    if (browserVersion.isIos() && iosFuncName && testApi(iosFuncName, false)) {
        return () => callApi(iosFuncName, false)
    }
    return null
}

/**
 * 快速创建跳转页面用的接口
 * @param {number} androidPageCode 安卓的页面代码
 * @param {string} iosFuncName ios的跳转方法名
 * @return {Function|null} 这个函数会带有一个boolean参数，表示是否需要保持当前页面不关闭，默认关闭
 */
function createJumpApi(androidPageCode, iosFuncName) {
    if (browserVersion.isAndroid() && testApi('jumpPage', true)) {
        return holdCurrentPage => {
            // 之前安卓会在jump的同时自动关闭网页。出现finishPageV2接口后就需要手动调用才关闭了
            if (!holdCurrentPage && testApi('finishPageV2', true)) {
                callApi('finishPageV2', true)
            }
            callApi('jumpPage', true, androidPageCode)
        }
    }
    if (browserVersion.isIos() && testApi(iosFuncName, false)) {
        return holdCurrentPage => {
            if (holdCurrentPage) {
                // 调用后不会关闭当前网页的接口
                const tempJumpFuncName = iosFuncName.startsWith('JSMessage_') ? `${iosFuncName}_Temp` : `JSMessage_${iosFuncName}_Temp`
                console.log(tempJumpFuncName)
                if (testApi(tempJumpFuncName, false)) {
                    callApi(tempJumpFuncName, false)
                    return
                }
            }
            callApi(iosFuncName, false)
        }
    }
    return null
}

/**
 * 打开某人的profile页面
 * @param {string} openId
 */
export const openProfile = (() => {
    if (browserVersion.isAndroid() && testApi('openProfile', true)) {
        return openId => callApi('openProfile', true, openId)
    }
    if (browserVersion.isIos() && testApi('JSMessage_jumpToProfileByOpenID', false)) {
        return openId => callApi('JSMessage_jumpToProfileByOpenID', false, openId)
    }
    return null
})()

/**
 * 调用ios原生内购商品接口
 * @param {string} openId
 */
export const callInAppPurchase = (() => {
    if (browserVersion.isIos() && testApi('JSMessage_CallInAppPurchase', false)) {
        return openId => callApi('JSMessage_CallInAppPurchase', false, openId)
    }
    return null
})()

/**
 * 打开某人的聊天页面。注意需要先判断好是否能够聊天，再来调用
 * @param {string} openId
 * @param {string} name 用户姓名，ios需要这个参数，显示在页面标题上
 */
export const jumpToSendMessage = (() => {
    /* eslint-disable no-unused-vars */
    if (browserVersion.isAndroid() && testApi('openChatByOpenId', true)) {
        return (openId, name) => callApi('openChatByOpenId', true, openId)
    }
    if (browserVersion.isIos() && testApi('JSMessage_jumpToConversationv2', false)) {
        return (openId, name) => callApi('JSMessage_jumpToConversationv2', false, [openId, name])
    }
    if (browserVersion.isIos() && testApi('JSMessage_jumpToConversation', false)) {
        return (openId, name) => callApi('JSMessage_jumpToConversation', false, openId)
    }
    /* eslint-enable no-unused-vars */
    return null
})()

/**
 * 异步获取本地用户登录态
 * @return {Promise|null}
 */
export const getSessionKey = (() => {
    if (browserVersion.isAndroid() && testApi('getSessionKey', true)) {
        return () => {
            return new Promise(resolve => {
                const funcName = `__API__${randomString(6)}`
                window[funcName] = resolve
                callApi('getSessionKey', true, funcName)
            })
        }
    }
    if (browserVersion.isIos() && testApi('JSMessage_ClickAndPassSessionKey', false)) {
        return () => {
            return new Promise(resolve => {
                const oldFunc = window.getSessionKey
                window.getSessionKey = sessionKey => {
                    window.getSessionKey = oldFunc
                    resolve(sessionKey)
                }
                callApi('JSMessage_ClickAndPassSessionKey', false)
            })
        }
    }
    return null
})()

/**
 *  隐藏顶部导航栏
 */
export const hideNavigationBar = (() => {
    if (browserVersion.isAndroid() && testApi('setShowTitleBar', true)) {
        return () => callApi('setShowTitleBar', true, false)
    }
    if (browserVersion.isIos() && testApi('JSMessage_hideNavigationBar', false)) {
        return () => callApi('JSMessage_hideNavigationBar', false)
    }
    return null
})()

/**
 *  显示顶部导航栏
 */
export const showNavigationBar = (() => {
    if (browserVersion.isAndroid() && testApi('setShowTitleBar', true)) {
        return () => callApi('setShowTitleBar', true, true)
    }
    if (browserVersion.isIos() && testApi('JSMessage_showNavigationBar', false)) {
        return () => callApi('JSMessage_showNavigationBar', false)
    }
    return null
})()

export const closeWebView = (() => {
    if (browserVersion.isAndroid() && testApi('finishPageV2', true)) {
        return () => callApi('finishPageV2', true)
    }
    if (browserVersion.isAndroid() && testApi('finishPage', true)) {
        return () => callApi('finishPage', true)
    }
    if (browserVersion.isIos() && testApi('JSMessage_closeWebVC', false)) {
        return () => callApi('JSMessage_closeWebVC')
    }
    if (browserVersion.isIos() && testApi('JSMessage_backToMeVC', false)) {
        return () => callApi('JSMessage_backToMeVC')
    }
    return null
})()

/**
 * 关闭web页面，返回客户端页面
 */
// export const closeWebView = createNoArgApi('finishPage', 'JSMessage_closeWebVC')

/**
 * 在菜单栏显示反馈按钮
 */
export const showFeedbackBtn = createNoArgApi('forceShowFeedbackOnTitleBar', 'JSMessage_shouldShowFeedbackButton')

/**
 * 打开自己的profile
 */
export const jumpToProfile = createJumpApi(-3, 'jumpToProfile')

/**
 * 跳转到Get Free Coins页面
 */
export const jumpToFreeCoins = createJumpApi(-4, 'jumpToFreeCoins')

/**
 * 跳转到Charmers页面
 */
export const jumpToCharmers = createJumpApi(-5, 'jumpToCharmers')

/**
 * 跳转到认证照片的页面
 */
export const jumpToVerifyPhoto = createJumpApi(-2, 'jumpToVerifyPhoto')

/**
 * 跳转到认证收入的页面
 */
export const jumpToVerifyIncome = createJumpApi(-26, 'jumpToVerifyIncome')

/**
 * 跳转到Verify的页面
 */
export const jumpToVerify = createJumpApi(-9, 'jumpToVerify')

/**
 * 打开系统分享
 */
export const jumpToSystemShare = createJumpApi(-1, 'systemShare')

/**
 * 跳转到Visitors的页面
 */
export const jumpToVisitors = createJumpApi(-13, 'jumpToVisitors')

/**
 * 跳转到Vouch的页面
 */
export const jumpToVouch = createJumpApi(-21, 'jumpToVouch')

/**
 * 跳转到设置页面
 */
export const jumpToSetting = createJumpApi(-19, 'jumpToSetting')

/**
 * 跳转到Lookbook的页面
 */
export const jumpToLookBook = createJumpApi(-25, 'jumpToLookbook')

/**
 * 跳转到Topic的页面
 */
export const jumpToTopic = createJumpApi(-10, 'jumpToTopic')

/**
 * 跳转到LikeList的页面
 */
export const jumpToLikeList = createJumpApi(-23, 'jumpToLikeList')

/**
 * 跳转到发送Topic的页面
 */
export const jumpToSendTopic = createJumpApi(-27, 'jumpToSendTopic')

/**
 * 跳转到筛选的页面
 */
export const jumpToPreferences = createJumpApi(-17, 'jumpToPreferences')

/**
 * 跳转到邀请的页面
 */
export const jumpToInviteFriends = createJumpApi(-18, 'jumpToInviteFriends')

/**
 * 跳到Me->Black
 */
export const jumpToBlack = createJumpApi(-22, 'JSMessage_jumpToLuxyBlackCenter')

/**
 * 跳转到Luciana
 */
export const jumpToLuciana = createJumpApi(-30, 'JSMessage_jumpToLuciana')

/**
 * 跳到应用商店
 */
export const jumpToRateAPP = createNoArgApi('showGoogleMarket', 'jumpToRateApp')

/**
 * 生成指定长度的随机字符串序列
 * @param {number?} len
 * @returns {string}
 */
function randomString(len = 32) {
    const chars = 'GQM5s7KdZhr8zFV3X4CHfU6kIq2cgTBDnoJamSyNOeYW9Rt01pLblvwiuPExjA'
    const maxPos = chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
}

/**
 * 跳转到首页Match页面
 */
export const jumpToMatch = createJumpApi(-16, 'jumpToMatch')

/**
 * 跳转到首页Boost页面
 */
export const jumpToBoost = createJumpApi(-12, 'jumpToBoost')

/**
 * (中国版)跳转到删除账号register
 */
export const jumpToDeleteAccountZhCn = createJumpApi(-35, 'JSMessage_DeleteAccount_CN')

/**
 * (中国版)跳转到verify income
 */
export const jumpToVerifyIncomeZhCn = createJumpApi(-36, 'JSMessage_jumpToVerifyIncome_CN')

/**
 * (中国版)跳转到打开app,对于没有初始化过程的安卓就是调用跳match页面的接口所以调用-16
 */
export const jumpToGetInAppZhCn = createJumpApi(-16, 'JSMessage_jumpToVerifyIncome_CN')

export default {
    // 以下接口需传参调用
    openProfile,
    jumpToSendMessage,
    callInAppPurchase,
    // 以下接口无需参数
    hideNavigationBar,
    showNavigationBar,
    closeWebView,
    jumpToBlack,
    jumpToLuciana,
    getSessionKey,
    jumpToProfile,
    showFeedbackBtn,
    jumpToFreeCoins,
    jumpToCharmers,
    jumpToVerifyPhoto,
    jumpToVerifyIncome,
    jumpToVerifyIncomeZhCn,
    jumpToDeleteAccountZhCn,
    jumpToGetInAppZhCn,
    jumpToVerify,
    jumpToSystemShare,
    jumpToVisitors,
    jumpToVouch,
    jumpToSetting,
    jumpToLookBook,
    jumpToTopic,
    jumpToLikeList,
    jumpToSendTopic,
    jumpToPreferences,
    jumpToInviteFriends,
    jumpToRateAPP,
    jumpToMatch,
    jumpToBoost,
    testApi
}
