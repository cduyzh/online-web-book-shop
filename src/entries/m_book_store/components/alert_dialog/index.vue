<template>
    <div class="alert-dialog-wrapper" v-show="visible">
        <div class="alert-dialog">
            <i v-show="iconClassName" class="dialog-icon" :class="iconClassName"></i>
            <p :class="{'des':index!==0}" class="dialog-text" v-text="item" v-for="(item,index) in messageList" :key="item">
            </p>
            <div class="confirm-btn-wrapper">
                <button class="console-btn" @click="closeNoCallback">Not Now</button>
                <button class="confirm-btn" @click="close">Buy Now</button>
            </div>
        </div>
    </div>
</template>

<script>
    /**
             * @example
             * this.$alertDialog.show({message: 'message', iconClassName:'my-imgs-above-message'}).then(this.doSthWhenClosed)
             * this.$alertDialog.showSuccess('message').then(this.doSthWhenClosed)
             * this.$alertDialog.showFail('message').then(this.doSthWhenClosed)
             * this.$alertDialog.showLoading('message').then(this.doSthWhenClosed)
             */

    import {mapState} from 'vuex'

    export default {
        name: 'alert-dialog',
        data() {
            return {
                // 是否显示弹窗
                visible: false,
                // 文字上方的图标样式，为空则不显示图标
                iconClassName: '',
                row1: '',
                row2: '',
                row3: '',
                messageList: [],
                // 窗口关闭回调方法，用来构造show方法返回的Promise
                closeHandler: null
            }
        },
        computed: {
            ...mapState({
                vxTrack: state => state.boxgames.track,
                vxOpenId: state => state.boxgames.openId,
            }),
        },
        methods: {
            closeNoCallback() {
                ga('send', 'event', 'BoxesNotNowClick', this.vxOpenId, this.vxTrack)
                console.log(`BoxesNotNowClick, ${this.vxOpenId}, ${this.vxTrack}`);
                this.visible = false
            },
            close() {
                this.visible = false
                this.callCloseHandler()
            },
            show(arr, iconClassName) {
                this.messageList = arr
                this.iconClassName = iconClassName || ''
                this.visible = true
                // this.callCloseHandler()
                // debugger
                return new Promise(resolve => {
                    this.closeHandler = resolve
                    // debugger
                })
            },
            callCloseHandler() {
                if (this.closeHandler) {
                    this.closeHandler()
                    this.closeHandler = null
                }
            },
            showSuccess(...textRowArray) {
                // console.log(...textRowArray)
                return this.show(...textRowArray, 'succeed')
            },
            showFail(...textRowArray) {
                // console.log(...textRowArray)
                return this.show(...textRowArray, 'failed')
            },
            showLoading(...textRowArray) {
                return this.show(...textRowArray, 'loading')
            },
            showNoCoins(...textRowArray) {
                return this.show(...textRowArray, 'nocoins')
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../../../common_assets/basic_const';

    .alert-dialog-wrapper {
        position: fixed;
        top: 0;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 99;
        width: 100%;
        padding: 0 30px;

        .alert-dialog {
            background-color: #fff;
            margin: 0 auto;
            border-radius: 10px;
            padding-bottom: 1px;
            top: 18%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            .des {
                font-size: 16px !important;
                color: #adadad !important;
                margin-top: 10px;
            }
            .dialog-icon {
                margin-top: 40px;
                display: block;
                background-size: contain;
                width: 60px;
                height: 60px;
                margin-bottom: 10px;
                &.succeed {
                    background-image: url(imgs/toast_succeed.png);
                }
                &.failed {
                    background-image: url(imgs/toast_failed.png);
                }
                &.loading {
                    background-image: url(imgs/toast_loading.png);
                    animation: spin 1300ms infinite linear;
                }
                &.nocoins {
                    background-image: url(imgs/no_coins.jpg);
                    background-repeat: no-repeat;
                }
                @keyframes spin {
                    0% {
                        transform: rotate(360deg);
                    }
                    100% {
                        transform: rotate(0deg);
                    }
                }
            }
            .dialog-text {
                color: #333;
                font-size: 18px;
                margin: 15px 0;
                font-family: 'Roboto Condensed', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, cursive;
                // padding: 28px 15px 25px;
                text-align: center;
                word-break: break-all;
                white-space: pre-wrap;
            }
            .confirm-btn-wrapper {
                padding: 15px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .confirm-btn {
                width: 48%;
                height: 40px;
                font-size: 16px;
                color: #fff;
                background-color: $basic-primary;
                line-height: 40px;
                border-radius: 5px;
                padding: 0;
            }
            .console-btn {
                $height: 42px;
                width: 48%;
                height: $height;
                font-size: 16px;
                color: $basic-primary;
                background-color: #fff;
                line-height: $height;
                border-radius: 5px;
                border: 1px solid $basic-primary;
                padding: 0;
            }
        }
    }
</style>
