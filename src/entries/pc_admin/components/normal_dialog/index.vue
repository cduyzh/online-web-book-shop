<template>
    <div class="normal-dialog-wrapper" v-show="visible">
        <div class="normal-dialog" :class="dialogClass">
            <div class="normal-dialog__header">
                <span class="normal-dialog__title">{{dialogTitle}}</span>
                <div class="normal-dialog__headerbtn" @click="close"></div>
            </div>
            <component :is="contentComponentName"
                       :dialog-data="dialogData"
                       v-if="mountContent"
                       class="normal-dialog__body"
                       @set-title="setTitle"
                       @set-close-bundle="setCloseBundle"
                       @complete="close"
                       ref="dialogContent"
            ></component>
        </div>
    </div>
</template>

<script>
    /**
     * @example
     * const dlg = this.$dialog.showDialog(DialogType.XXX, {studentId: 'aaabbc', studentName: '李小花'})
     * dlg.onOpen((dialogType) => {
     *     // do something ...
     * })
     * dlg.onClose(({newName, otherData}) => {
     *     if (newName) {
     *         // do something ...
     *     }
     * })
     */
    import {mapMutations} from 'vuex'
    import {DialogType, DialogStyle, componentConfigs} from './dialog_configs'
    import loadingDialog from './content/loading.vue'

    // 如果加载弹框内容超过了这个时间还没加载好，就显示loading
    const LOADING_DIALOG_PENDDING_TIME = 300
    const STATE_CLOSED = 1
    // 正在加载内容组件，此时时限还没到，不展示任何弹框
    const STATE_LOAD_PENNDING = 2
    // 正在加载内容组件，此时展示loading状态
    const STATE_LOADING = 3
    const STATE_SHOWN = 4
    const STATE_CLOSING = 5

    // 在加载弹框js文件时显示的loading状态，需要提前加载好
    componentConfigs.push({
        type: DialogType.LOADING,
        loader: () => Promise.resolve(loadingDialog),
        closeOnClickOutside: true,
        dialogClass: DialogStyle.TITLE_AT_MIDDLE,
    })

    export default {
        name: 'normal-dialog',
        data() {
            return {
                contentComponentName: '',
                dialogData: {},
                dialogTitle: '',
                dialogClass: DialogStyle.TITLE_AT_MIDDLE,
                currentDialogType: DialogType.NONE,
                // TODO ESC
                closeOnClickOutside: false,
                // 是否正在加载内容组件js文件
                dialogState: STATE_CLOSED,
                // 弹窗从隐藏到展示成功的事件，不包括已经展示出来了，又showDialog切换到另一个框的情况
                // 参数为展示的弹框type
                openListeners: [],
                // 弹窗关闭动画开始的事件
                // 参数为关闭时的弹框type，和closeBundle对象
                closeListeners: [],
                // showDialog时返回出去用于注册回调方法的对象
                showDialogResult: {
                    onOpen: callback => this.openListeners.push(callback),
                    onClose: callback => this.closeListeners.push(callback),
                },
                // 关闭弹框时传入回调函数的数据
                closeBundle: {},
                // 是否显示弹窗，双向绑定到el-dialog上的变量
                visible: false,
            }
        },
        computed: {
            mountContent() {
                // pendding状态结束后才挂载组件，这样可以确保pendding状态中（contentComponentName是上次的值，loader还未回调），内容组件不会过早地触发了mounted事件
                return this.dialogState !== STATE_CLOSED && this.dialogState !== STATE_LOAD_PENNDING
            },
        },
        components: {
            [loadingDialog.name]: loadingDialog,
        },
        methods: {
            ...mapMutations({
                vxSetShowingDlg: 'setShowingDlg',
            }),
            close() {
                this.visible = false
                this.vxSetShowingDlg(false)
                this.dialogState = STATE_CLOSING
                // 等待关闭动画结束。进入STATE_CLOSED状态，并销毁内容组件，下次再弹同一个框时才会调用内容组件的mounted
                setTimeout(() => {
                    if (this.dialogState === STATE_CLOSING) {
                        this.dialogState = STATE_CLOSED

                        this.currentDialogType = DialogType.NONE;
                        this.callCloseListeners()
                    }
                }, 320)
            },
            /**
             * 显示指定弹框
             * @param {string} dialogType 定义在dialog_configs中的DialogType
             * @param {object?} dialogData 要传递给窗口内容组件的数据
             */
            showDialog(dialogType, dialogData = {}) {
                const config = componentConfigs.find(item => item.type === dialogType)
                if (!config) {
                    console.error(`找不到弹窗类型${dialogType}对应的组件`)
                    return this.showDialogResult
                }
                if (dialogType !== DialogType.LOADING) {
                    this.showLoadingAfterAWhile()
                }
                this.dialogState = STATE_LOAD_PENNDING
                config.loader().then((component) => {
                    // 在loading状态下用户关闭了弹框
                    if (this.dialogState !== STATE_LOAD_PENNDING && this.dialogState !== STATE_LOADING) {
                        return
                    }
                    this.currentDialogType = dialogType
                    this.dialogState = STATE_SHOWN
                    this.setupComponent(config, component.default || component, dialogData)
                    this.visible = true

                    // 有输入框的弹框在ios上输入时会出现光标飞走的问题，需要消除掉父组件滚动条
                    if (config.lockScroll) {
                        this.vxSetShowingDlg(true)
                    }
                    this.callOpenListeners(dialogType)
                })

                return this.showDialogResult
            },
            setTitle(title) {
                this.dialogTitle = title
            },
            setCloseBundle(bundle) {
                if (typeof bundle !== 'object') {
                    console.error(`expected a object, but the bundle is ${bundle}`)
                }
                this.closeBundle = bundle
            },
            // 延迟一下，如果还没加载好，再显示加载动画
            showLoadingAfterAWhile() {
                // 如果当前窗口已经显示出来了，可以直接显示loading，否则pendding状态下会显示一个无内容的弹框。setTimeout期间如果要显示的对话框已经加载过，会在timeout之前就先完成loader的
                const duration = this.dialogState === STATE_SHOWN ? 0 : LOADING_DIALOG_PENDDING_TIME
                setTimeout(() => {
                    if (this.dialogState !== STATE_LOAD_PENNDING) {
                        return
                    }
                    this.dialogState = STATE_LOADING
                    const config = componentConfigs.find(item => item.type === DialogType.LOADING)
                    this.setupComponent(config, loadingDialog)
                    this.visible = true
                }, duration)
            },
            setupComponent(config, component, dialogData) {
                Vue.component(component.name, component)
                this.dialogData = dialogData
                this.closeOnClickOutside = !!config.closeOnClickOutside
                this.dialogClass = config.dialogClass || DialogStyle.TITLE_AT_MIDDLE
                this.contentComponentName = component.name
            },
            callOpenListeners(dialogType) {
                if (dialogType !== DialogType.LOADING) {
                    const listeners = this.openListeners.slice()
                    this.openListeners = []
                    listeners.forEach(fn => fn(dialogType))
                }
            },
            callCloseListeners() {
                const listeners = this.closeListeners.slice()
                this.closeListeners = []

                const closeBundle = this.closeBundle
                this.closeBundle = {};

                listeners.forEach(fn => fn(closeBundle))
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "../../../../common_assets/basic_const";

    .normal-dialog-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: rgba(0, 0, 0, .6);
        z-index: 99;
        width: 100%;

        .normal-dialog {
            width: 80%;
            background-color: #fff;
            margin: 0 auto;
            border-radius: 10px;
            padding-bottom: 1px;
            top: 50%;
            transform: translateY(-50%);
            max-width: 400px;
            position: relative;
            max-height: 100%;
            overflow: auto;
            .normal-dialog__body > div {
                transition: height 0.5s;
            }
            .normal-dialog__header {
                color: #191919;
                font-size: 18px;
            }
            .normal-dialog__title {
                word-break: break-all;
                font-weight: bold;
            }
            .normal-dialog__headerbtn {
                background: url(./imgs/x.png);
                width: 25px;
                height: 25px;
                background-size: 100% 100%;
                position: absolute;
                top: 0;
                right: 0;
                margin-top: 10px;
                margin-right: 10px;
                z-index: 1;
                cursor: pointer;
            }
            textarea {
                $margin-x: 15px;
                margin: 0 $margin-x;
                width: calc(100% - #{$margin-x * 2});
                font-size: 15px;
                color: #191919;
                border: 1px solid #eeeeee;
                border-radius: 5px;
                padding: 10px;
                outline: medium;
                resize: none;
            }

            // 标题居中，底部有一个确定按钮的样式
            &.middle-title-dialog {
                .normal-dialog__header {
                    height: 58px;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                }
                .bottom-buttons {
                    margin: 30px auto;
                    text-align: center;
                }
                .bottom-button {
                    width: 200px;
                    height: 35px;
                    font-size: 16px;
                    color: #fff;
                    background-color: $basic-primary;
                    line-height: 35px;
                    border-radius: 20px;
                    padding: 0;
                    transition: color .2s linear, background-color .2s linear, border .2s linear;
                    &:hover {
                        background-color: $basic-primary-highlight;
                    }
                    &:active {
                        background-color: mix($basic-primary, #000, 95%);
                    }
                    &[disabled] {
                        background-color: $basic-primary-highlight;
                        cursor: not-allowed;
                    }
                }
            }
        }
    }
</style>
