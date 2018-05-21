import Vue from 'vue'
import httpRequestor from 'common_libs/http_requestor'
import App from './app.vue'

// if (window.gDevEnv) {
//     require('./libs/mock')
// }

/** *****************全局变量****************** */
window.httpRequestor = httpRequestor
// 正式环境测试环境都需要跨域
httpRequestor.withCredentials = true

/** ***************全局变量 end****************** */

new Vue(App).$mount('#app')
