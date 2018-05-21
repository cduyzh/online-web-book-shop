import Vue from 'vue'
// import {Toast} from 'mint-ui'
import httpRequestor from 'common_libs/http_requestor'
import App from './app.vue'

// 开发或测试时候使用
if (window.gDevEnv) {
    require('./libs/mock/mock')
}

/** *****************全局变量****************** */
window.httpRequestor = httpRequestor
// 默认请求错误处理
// httpRequestor.defaultErrorHandler = (result, showToast) => {
//     if (showToast) {
//         Toast({message: result.message, position: 'top'})
//     }
// }

/** ***************全局变量 end****************** */

new Vue(App).$mount('#app')