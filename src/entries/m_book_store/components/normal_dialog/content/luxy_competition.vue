<template>
    <div class="luxy-competition-dlg">
        <p class="title">
            Email address
        </p>
        <input type="text" class="email" placeholder="Complete before hitting Confirm."
            maxlength="150"
            v-model.trim='vxEmail'
            :class="{invalid:showWarning&&!vxEmail||!isEmail}"
            @input="checkEmail">
        <p class="title">
            Tell us more about you or your proudest<br>achievement!
        </p>
        <textarea placeholder="Complete before hitting Confirm. To increase your chance, fill in at least a sentence."
                  v-model.trim="vxmyProudMsg"
                  maxlength="400"
                  :class="{invalid:showWarning&&!vxmyProudMsg}"
                  ></textarea>
        <div class="bottom-buttons">
            <mt-button class="bottom-button" :disabled="submitting" @click="submit" :class="{'disabled-bgc': showWarning||!vxEmail||!vxmyProudMsg}">
                <mt-spinner v-if="submitting" type="fading-circle" color="#fff" slot="icon" :size="18"></mt-spinner>
                Confirm
            </mt-button>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {checkParams} from 'common_libs/util'
    import {showNavigationBar} from 'common_libs/app_bridge'
    import contentMixin from '../dialog_content_mixin'

    export default {
        name: 'luxy-competition-dlg',
        mixins: [contentMixin],
        props: {
            dialogData: {
                type: Object,
                required: true,
                validator: data => checkParams(data, {
                    openId: 'string', // 当前用户自己的openId
                }, 'dialogData')
            },
        },
        data() {
            return {
                // 验证是否是email
                isEmail: true,
                // 是否正在发送提交请求
                submitting: false,
                // 是否标红
                showWarning: false,
            };
        },
        computed: {
            // 需要提交、保存的email
            vxEmail: {
                get () {
                    return this.$store.state.cover.email
                },
                set (value) {
                    this.$store.commit('cover/updateEmail', value)
                }
            },
            // 需要提交、保存的message
            vxmyProudMsg: {
                get () {
                    return this.$store.state.cover.message
                },
                set (value) {
                    this.$store.commit('cover/updateMessage', value)
                }
            }
        },
        methods: {
            ...mapActions({
                vxSignUpCover: 'cover/signUpCover'
            }),
            // 验证email
            checkEmail() {
                const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                // console.log(reg.test(this.vxEmail))
                this.isEmail = reg.test(this.vxEmail)
            },
            async submit() {
                window.ga('send', 'event', 'competition_confirm', this.dialogData.openId)
                this.showWarning = true
                if (!this.vxEmail || !this.vxmyProudMsg || !this.isEmail) {
                    return
                }
                this.submitting = true
                try {
                    await this.vxSignUpCover({
                        openId: this.dialogData.openId,
                        email: this.vxEmail,
                        message: this.vxmyProudMsg,
                    })
                } catch (e) {
                    this.submitting = false
                    return
                }
                this.closeDialog({isSigndeUp: true})
                const backUrl = encodeURIComponent(window.location.href)
                const buyCoverCompetitionUrl = `${window.gBaseUrl}/go#/buy_goods?c=400001&backUrl=${backUrl}&openid=${this.dialogData.openId}&selected=9.99`
                if (showNavigationBar) {
                    showNavigationBar()
                }
                window.location.href = buyCoverCompetitionUrl
            },
        },
        mounted() {
            this.setDialogTitle('Apply')
        },
    }
</script>


<style lang="scss" rel="stylesheet/scss">
    @import "../../../../../common_assets/basic_const";

    .luxy-competition-dlg {
        padding-top: 15px;
        font-family: 'Roboto Condensed';
        .title {
            font-size: 13px;
            color: #7c7c7c;
            margin: 10px 15px;
            line-height: 130%;
        }
        .email{
            font-size: 14px;
            margin: 0px 15px 10px;
            width: calc(100% - 30px);
            line-height: 130%;
            border: 1px solid #eeeeee;
            border-radius: 5px;
            padding: 10px;
            font-family: 'Roboto Condensed';
            &.invalid {
                border-color: $basic-warning;
            }
        }
        textarea {
            font-size: 14px !important;
            height: 150px;
            font-family: 'Roboto Condensed';
            &.invalid {
                border-color: $basic-warning;
            }
        }
        button {
            .mint-button-icon {
                margin-top: -3px;
                margin-right: 4px;
            }
        }
        .disabled-bgc {
            background-color: #e3d5c3 !important;
        }
    }
</style>
