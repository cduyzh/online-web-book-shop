<template>
    <div class="alert-dialog-wrapper" v-show="visible">
        <div class="alert-dialog">
            <p v-show="title" class="title-name">{{title}}</p>
            <i v-show="iconClassName" class="dialog-icon" :class="iconClassName"></i>
            <p :class="title ? 'dialog-text-grey':'dialog-text'">{{message}}</p>
            <div class="confirm-btn-wrapper">
                <button class="confirm-btn" @click="close">OK</button>
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

    export default {
        name: 'alert-dialog',
        data() {
            return {
                // 是否显示弹窗
                visible: false,
                // 文字上方的图标样式，为空则不显示图标
                iconClassName: '',
                // 文字上方的标题，为空则不显示
                title: '',
                message: '',
                // 窗口关闭回调方法，用来构造show方法返回的Promise
                closeHandler: null,
            }
        },
        methods: {
            close() {
                this.visible = false
                this.callCloseHandler()
            },
            show(config) {
                this.title = config.title || ''
                this.message = config.message || ''
                this.iconClassName = config.iconClassName || ''
                this.visible = true
                this.callCloseHandler()
                return new Promise(resolve => {
                    this.closeHandler = resolve
                })
            },
            callCloseHandler() {
                if (this.closeHandler) {
                    this.closeHandler()
                    this.closeHandler = null
                }
            },
            showSuccess(message) {
                return this.show({message, iconClassName: 'succeed'})
            },
            showFail(message) {
                return this.show({message, iconClassName: 'failed'})
            },
            showLoading(message) {
                return this.show({message, iconClassName: 'loading'})
            },
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "../../common_assets/basic_const";

    .alert-dialog-wrapper {
        position: fixed;
        top: 0;
        height: 100%;
        background-color: rgba(0, 0, 0, .6);
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
            .title-name {
                margin-top: 30px;
                font-size: 18px;
            }
            .dialog-icon {
                margin-top: 50px;
                display: block;
                background-size: contain;
                width: 51px;
                height: 51px;
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
                color: #191919;
                font-size: 18px;
                padding: 28px 15px 25px;
                text-align: center;
                word-break: break-all;
                white-space: pre-wrap;
            }
            .dialog-text-grey {
                color: #B5B6B6;
                font-size: 15px;
                padding: 28px 15px 25px;
                text-align: center;
            }
            .confirm-btn-wrapper {
                padding: 15px;
                width: 100%;
            }
            .confirm-btn {
                $height: 40px;
                width: 100%;
                height: $height;
                font-size: 16px;
                color: #fff;
                background-color: $basic-primary;
                line-height: $height;
                border-radius: 5px;
                padding: 0;
            }
        }
    }
</style>
