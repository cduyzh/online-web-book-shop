<template>
    <div id="app">
        <router-view :class="{'app-no-scroll':vxIsShowingDlg}"></router-view>

        <normal-dialog ref="dialog"></normal-dialog>
        <box-games-alert ref="boxGamesAlert"></box-games-alert>
    </div>
</template>

<script>
    import Vue from 'vue'
    import VueRouter from 'vue-router'
    import { mapState } from 'vuex'
    import util from 'common_libs/util'
    import iView from 'iview';
    import 'iview/dist/styles/iview.css';
    import MintUI from 'mint-ui'
    import 'mint-ui/lib/style.css'
    import boxGamesAlert from './components/alert_dialog/index.vue'
    import router from './router'
    import store from './store'
    import vTitle from '../../vue_plugins/v_title'
    import vReport from '../../vue_plugins/v_report'
    import normalDialog from './components/normal_dialog/index.vue'

    Vue.prototype.$util = util
    Vue.use(VueRouter)
    Vue.use(MintUI)
    Vue.use(vTitle)
    Vue.use(vReport)
    Vue.use(iView);

    export default {
        name: 'app',
        data() {
            return {}
        },
        // 通过 router 配置参数注入路由，从而让整个应用都有路由功能
        router,
        computed: {
            ...mapState({
                vxIsShowingDlg: state => state.isShowingDlg
            })
        },
        store,
        components: {
            normalDialog,
            boxGamesAlert
        },
        mounted() {
            Vue.prototype.$dialog = this.$refs.dialog
            Vue.prototype.$boxGamesAlert = this.$refs.boxGamesAlert
            // 加载动画隐藏
            this.$nextTick(() => {
                this.isLoading = false
            })
        }
    }
</script>

<!-- 全局样式 -->
<style lang="scss" src="../../common_assets/basic_m.scss"></style>
<style lang="scss" rel="stylesheet/scss">
    body {
        padding: 0;
        margin: 0;
        font-size: 12px;
        overflow-x: hidden; // 设置点击链接的时候出现的高亮颜色。显示给用户的高光是他们成功点击的标识，以及暗示了他们点击的元素
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }

    [v-cloak] {
        display: none;
    }

    p {
        margin: 0;
    }

    /* 显示弹框时隐藏滚动条，以免ios上输入框输入文字时，光标会飞掉 */

    .app-no-scroll {
        height: 100vh;
        overflow: hidden;
    }
</style>