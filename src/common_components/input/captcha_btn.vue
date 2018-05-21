<template>
    <span class="captcha-btn no-highlight"
          :class="{'disabled':!canSendSms}"
          @click="sendSmsNum">{{btnText}}
    </span>
</template>

<script type="text/babel">
    import {isPhoneNum} from 'common_libs/util'

    // 发送短信验证码失败事件，会携带一个错误信息字符串
    const SEND_SMS_FAILED = 'send-sms-failed';

    export default {
        props: {
            sendSms: {
                type: Function
            },
            phoneNum: {
                type: String,
                default: ''
            },
            // 可点击状态下的wording
            clickableText: {
                type: String,
                default: '发送验证码'
            },
            // 倒计时状态下的wording
            countingText: {
                type: String,
                default: 's后可重新发送'
            },
        },
        computed: {
            canSendSms() {
                return isPhoneNum(this.phoneNum) && this.smsCountDown <= 0
            },
            btnText() {
                if (this.smsCountDown <= 0) {
                    return this.clickableText
                } else {
                    return this.smsCountDown + this.countingText
                }
            },
        },
        data() {
            return {
                // 倒计时数字
                smsCountDown: 0,
                // 发验证码计时器
                sendSmsTimer: 0,
            }
        },
        methods: {
            sendSmsNum,
            startSendSmsCountDown,
        },
    };

    async function sendSmsNum() {
        if (this.smsCountDown > 0 || !isPhoneNum(this.phoneNum)) {
            return;
        }

        this.startSendSmsCountDown();
        try {
            await this.sendSms()
        } catch (result) {
            const errMsg = result.message
            if (window.Toast) {
                window.Toast({text: errMsg, type: 'warn'})
            } else if (this.$Message && this.$Message.warning) {
                this.$Message.warning(errMsg)
            }
            this.$emit(SEND_SMS_FAILED, errMsg);
            this.smsCountDown = 0;
            clearInterval(this.sendSmsTimer);
        }
    }

    /**
     * 开始发送验证码的倒计时
     */
    function startSendSmsCountDown() {
        this.smsCountDown = 60;
        // 清空已输入的验证码
        this.sendSmsTimer = setInterval(() => {
            if (--this.smsCountDown <= 0) {
                clearInterval(this.sendSmsTimer);
            }
        }, 1000);
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .captcha-btn {
        height: 100%;
        white-space: nowrap;
        // color: $text-highlight;
        color: #7771ed;
        cursor: pointer;
        &.disabled {
            // color: $text-hint;
            color: #757680;
            cursor: not-allowed;
        }
    }
</style>
