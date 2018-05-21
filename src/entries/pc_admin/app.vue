<template>
    <div id="app">
        <router-view :class="{'app-no-scroll':vxIsShowingDlg}"></router-view>

        <normal-dialog ref="dialog"></normal-dialog>
        <alert-dialog ref="alertDialog"></alert-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';
    import VueRouter from 'vue-router';
    import { mapState } from 'vuex'
    import util from 'common_libs/util'
    import iView from 'iview';
    import 'iview/dist/styles/iview.css';
    import MintUI from 'mint-ui'
    import 'mint-ui/lib/style.css'
    import alertDialog from 'common_components/alert_dialog/index.vue'
    import vTitle from 'vue_plugins/v_title'
    import router from './router';
    import store from './store';
    import normalDialog from './components/normal_dialog/index.vue'

    Vue.prototype.$util = util // 挂载到全局的公共函数
    Vue.use(VueRouter);
    Vue.use(MintUI)
    Vue.use(iView);
    Vue.use(vTitle);

    export default {
        name: 'app',
        data() {
            return {};
        },
        computed: {
            ...mapState({
                vxIsShowingDlg: state => state.isShowingDlg,
            }),
        },
        components: {
            normalDialog,
            alertDialog,
        },
        // 通过 router 配置参数注入路由，从而让整个应用都有路由功能
        router,
        store,
        mounted() {
            Vue.prototype.$dialog = this.$refs.dialog
            Vue.prototype.$alertDialog = this.$refs.alertDialog
            // 加载动画隐藏
            this.$nextTick(() => {
                this.isLoading = false;
            })
        },
    }
</script>

<!-- 全局样式 -->
<style lang="scss" src="../../common_assets/basic.scss"></style>
<style lang="scss" rel="stylesheet/scss">
    @import '../../common_assets/basic_const';
    #app {
        /* 显示弹框时隐藏滚动条，以免ios上输入框输入文字时，光标会飞掉 */
        .app-no-scroll {
            height: 100vh;
            overflow: hidden;
        }
    }
</style>