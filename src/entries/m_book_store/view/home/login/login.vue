<template>
    <div class="login-register-page">
        <div class="usercenter-login-content">
            <div class="usercenter-login-wrap">
                <div class="logo-title">
                    <img src="../imgs/Logo.png" alt="">
                    <h3 class="title">登录或注册</h3>
                </div>
                <div class="item-wrap" :class="{'captcha-zh-error':emailIsInvaild&&!emailOnFocus}">
                    <div class="item-label">邮箱</div>
                    <div class="item-content">
                        <limit-input @is-focus='onEmailFocus' @is-valid='onEmailHandleBlur' class="phone-input" placeholder="请输入邮箱" :max-length="30" :is-required="true" :validator="/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/" :invalid-filter="/~!#\$%\^\&\*\(\)_\+<>/g" :isValid.sync="isEmailValid" v-model="email">
                        </limit-input>
                    </div>
                    <p v-text="'格式错误'" v-show="emailIsInvaild&&!emailOnFocus" class="error-text"></p>
                </div>
                <div class="item-wrap" :class="{'captcha-zh-error':pwdIsinvaild&&!pwdOnFocus}">
                    <div class="item-label">密码</div>
                    <div class="item-content">
                        <limit-input @is-focus='onPwdFocus' @is-valid='onPwdHandleBlur' class="phone-input" :inputType="passWdType" placeholder="请输入密码" :max-length="20" :is-required="true" :validator="/^\w{8,}$/" :invalid-filter="/\W/g" :isValid.sync="isPassWord" v-model="password">
                        </limit-input>
                        <span @click="showPasswd=!showPasswd">
                            <Icon size='18' :type="showPasswd?'eye-disabled':'eye'"></Icon>
                        </span>
                    </div>
                    <p v-text="'密码格式错误'" v-show="pwdIsinvaild&&!pwdOnFocus" class="error-text"></p>
                </div>
                <i-button :disabled="!emailCanSubmit" :loading="sending" class="login-btn email-login-btn" @click.native="doEmailSignIn">
                    下一步
                </i-button>
            </div>
        </div>
    </div>

</template>

<script>
    import { Toast, Indicator } from 'mint-ui'
    import { mapActions, mapGetters, mapState } from 'vuex'
    import limitInput from 'common_components/input/limit_input.vue';
    import store from '../../../store'

    export default {
        name: 'user-center-login',
        data() {
            return {
                inviteCode: this.$route.query.invite || '',
                // 图形验证码
                imgCaptcha: '',
                // 是否正在发送请求
                sending: false,
                isEmailValid: false,
                isPassWord: false,
                isConfirmPassWord: false,
                verifyPic: '',
                randowPicNum: '',
                // 邮箱登录相关
                email: '',
                password: '',
                confirmPassword: '',
                captchaId: 0,
                // passwd可见
                showPasswd: false,
                // 密码输入错误显示提示
                pwdIsinvaild: false,
                // 正在输入密码
                pwdOnFocus: false,
                // 邮箱格式输入错误显示提示
                emailIsInvaild: false,
                // 正在输入邮箱
                emailOnFocus: false
            }
        },
        computed: {
            ...mapState({

            }),
            ...mapGetters({}),
            passWdType() {
                return this.showPasswd ? 'text' : 'password'
            },
            emailCanSubmit() {
                return this.isEmailValid && this.isPassWord
            },
        },
        methods: {
            ...mapActions({
                vxLogin: 'account/login',
            }),
            async doEmailSignIn() {
                Indicator.open({
                    spinnerType: 'fading-circle'
                });
                if (!this.emailCanSubmit) {
                    return
                }
                const postEmailData = {
                    email: this.email,
                    passWd: this.password,
                }
                console.log(postEmailData);
                this.sending = true
                try {
                    const res = await this.vxLogin(postEmailData)
                    console.log(res)
                    setTimeout(() => {
                        Indicator.close()
                        this.$router.push({ name: 'userInfo' })
                    }, 1500);
                } catch (err) {
                    this.sending = false
                    console.error(err)
                    this.password = ''
                    setTimeout(() => {
                        Indicator.close()
                        Toast({ message: err.message })
                    }, 1500);
                }
                this.sending = false
            },
            onPwdHandleBlur(isValid) {
                if (!isValid && !this.isPassWord) {
                    this.pwdIsinvaild = true
                } else {
                    this.pwdIsinvaild = false
                }
                this.pwdOnFocus = false
            },
            onEmailHandleBlur(isValid) {
                if (!isValid && !this.isEmailValid) {
                    this.emailIsInvaild = true
                } else {
                    this.emailIsInvaild = false
                }
                this.emailOnFocus = false
            },
            onEmailFocus(isFocus) {
                this.emailOnFocus = isFocus
            },
            onPwdFocus(isFocus) {
                this.pwdOnFocus = isFocus
            },
        },
        components: {
            limitInput,
        },
        beforeRouteEnter(to, from, next) {
            if (store.getters['account/isLoggedIn']) {
                next({ name: 'userInfo' })
            } else {
                next()
            }
        },
        mounted() {}
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .login-register-page {
        background: #efeff4;
        position: relative;
        @media screen and(max-width: 768px) {
            position: relative;
            height: 100vh;
        }
        @media screen and(max-width:320px) {
            height: 670px;
        }
        .usercenter-login-content {
            height: 966px;
            padding-top: 120px;
            @media screen and (max-width: 768px) {
                height: 100vh;
                padding: 214px 20px 0;
                background: #f9f9fd;
            }
            .usercenter-login-wrap {
                background: #ffffff;
                box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.04);
                border-radius: 12px;
                width: 672px;
                height: 624px;
                margin: 0 auto;
                position: relative;
                padding-top: 195px;
                display: flex;
                justify-content: flex-end;
                flex-direction: column;
                padding: 0 120px;
                @media screen and (max-width: 768px) {
                    width: 100%;
                    height: 383px;
                    padding: 30px 21px 0;
                    justify-content: flex-start;
                }
                .logo-title {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    top: -60px;
                    left: 50%;
                    transform: translateX(-50%);
                    position: absolute;
                    img {
                        width: 120px;
                        height: 120px;
                    }
                    h3 {
                        margin-top: 20px;
                        font-size: 20px;
                        color: #474f58;
                        letter-spacing: 0;
                        text-align: center;
                        white-space: pre;
                    }
                    @media screen and (max-width: 768px) {
                        top: -150px;
                        h3 {
                            font-size: 20px !important;
                            white-space: normal;
                            width: 266px;
                            margin-top: 5px;
                        }
                        img {
                            width: 76px;
                            height: 76px;
                        }
                    }
                }
                .item-wrap {
                    .ivu-input {
                        font-size: 14px;
                    }
                    position: relative;
                    height: 63px; // line-height: 50px;
                    display: flex;
                    align-items: flex-start;
                    background: #fff; // border-bottom: 1px solid #f1f1f2;
                    flex-direction: column;
                    margin-bottom: 20px;
                    .item-label {
                        font-size: 14px;
                        color: #475669;
                        letter-spacing: 0;
                    }
                    .item-content {
                        position: relative;
                        span {
                            position: absolute;
                            right: 10px;
                            color: #c0ccda;
                            top: 15px;
                            cursor: pointer;
                            padding: 0 10px;
                            @media screen and (max-width: 768px) {
                                top: 15px;
                            }
                        }
                        flex: 1;
                        height: 100%;
                        width: 100%;
                        display: flex;
                        align-items: center; // 修改iveiw的样式
                        .ivu-select-selection {
                            border: 0 transparent;
                            outline: none;
                            box-shadow: none;
                            width: 97%;
                        }
                        .ivu-select {
                            color: #333 !important;
                        }
                        .ivu-select-item-selected,
                        .ivu-select-item-selected:hover {
                            background: #7771ed;
                        }
                        .ivu-select-selection .ivu-select-selected-value {
                            font-size: 14px;
                        }
                        .ivu-select-selected-value,
                        input {
                            padding-left: 10px;
                        }
                        .phone-input,
                        .captcha-input {
                            border: 0;
                            height: 32px;
                            line-height: 1.5;
                            padding: 4px 7px;
                            font-size: 15px;
                            padding-left: 0px;
                            position: relative;
                            .eye-icon {
                                position: absolute;
                                right: 0;
                            }
                        }
                        .captcha-input {
                            flex-grow: 1;
                        }
                        .captcha-btn {
                            font-size: 15px;
                            line-height: 50px;
                            margin-right: 15px;
                        }
                    }
                    .img-captcha {
                        .captcha-input {
                            flex: 1 1 140px;
                        }
                        .ivu-input-wrapper {
                            width: 141px;
                        }
                        .captcha-img {
                            width: 108px;
                            height: 37px;
                            cursor: pointer;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            svg {
                                height: 56px;
                                @media screen and(max-width: 768px) {
                                    height: 46px;
                                }
                            }
                        }
                    }
                    @media screen and (max-width: 768px) {
                        /* height: 36px; */
                        margin-bottom: 25px;
                        .item-label {
                            /* display: none; */
                        }
                        .img-captcha {
                            .captcha-img {
                                width: 85px;
                            }
                        }
                    }
                }
                .item-wrap-s {
                    height: 25px;
                    display: flex;
                    align-items: center;
                    background: #fff;
                    flex-direction: row;
                    justify-content: space-between;
                    font-size: 14px;
                    color: #99a9bf;
                    font-weight: 700;
                    margin-top: 17px;
                    .third-party-sign {
                        cursor: pointer;
                        .sign-btn {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        img {
                            width: 21px;
                            height: 21px;
                            margin-right: 5px;
                        }
                    }
                    p {
                        cursor: pointer;
                    }
                    @media screen and (max-width: 768px) {
                        .third-party-sign {
                            font-size: 12px;
                        }
                        p {
                            font-size: 12px;
                        }
                    }
                }
                .login-btn {
                    display: flex;
                    justify-content: center;
                    text-align: center;
                    margin: 0 auto;
                    margin-top: 26px;
                    width: 100%;
                    height: 48px;
                    font-size: 14px;
                    letter-spacing: 0px;
                    color: #fff;
                    background-color: #888;
                    border-radius: 4px;
                    &:not([disabled]) {
                        color: #ffffff;
                        background-image: linear-gradient(270deg, #7771ed 0%, #68a7d4 100%);
                        box-shadow: 0 4px 4px 0 rgba(119, 113, 237, 0.2);
                    }
                }
                .login-wrap-bottom-des {
                    font-size: 14px;
                    color: #99a9bf;
                    letter-spacing: 0;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 24px;
                    margin-bottom: 52px;
                    span {
                        color: #7771ed;
                        font-weight: 700;
                        cursor: pointer;
                    }
                }
            }
        }
        .g-content {
            display: flex;
            justify-content: center;
            align-items: center !important;
            margin-top: 30px !important;
            margin-bottom: 10px;
        }
        .captcha-zh-error {
            color: #ff5050;
            .item-label {
                color: #ff5050 !important;
            }
            .ivu-input {
                border-color: #ff5050;
            }
            .error-text {
                position: absolute;
                bottom: -22px;
                @media screen and (max-width: 768px) {
                    bottom: -25px;
                }
            }
        }
        button>i {
            margin-top: 3px;
        }
    }
</style>