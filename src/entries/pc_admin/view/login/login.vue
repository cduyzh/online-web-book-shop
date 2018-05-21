<template>
	<div v-title="'后台登录'" class="sign-in-page">
		<Card class="sign-in-card">
			<i-form ref="signInForm" :model="forData" :rules="rules">
				<FormItem label="Username:" prop="userName">
					<i-input v-model="forData.userName" :maxlength="20" ref="userNameInput">
					</i-input>
				</FormItem>
				<FormItem label="Password:" prop="password">
					<i-input v-model="forData.password" type="password" @on-enter="onSubmit" :maxlength="20">
					</i-input>
				</FormItem>
				<div class="submit-btn-line">
					<i-button :loading='sending' type="primary" size="large" long class="submit-btn" @click="onSubmit">
						登录
					</i-button>
				</div>
			</i-form>
		</Card>
	</div>
</template>

<script>
    import { Toast } from 'mint-ui'
    import { mapActions } from 'vuex'
    import store from '../../store'

    export default {
        name: 'sign-in-page',
        data() {
            return {
                forData: {
                    userName: '',
                    password: '',
                },
                rules: {
                    userName: [
                        { required: true, message: '请填写管理员帐号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码不能低于6位', trigger: 'blur' }
                    ]
                },
                sending: false
            }
        },
        computed: {},
        methods: {
            ...mapActions({
                vxAdminLogin: 'admin/adminLogin',
            }),
            async onSubmit() {
                const isValid = await this.$refs.signInForm.validate()
                if (!isValid) {
                    return
                }
                this.sending = true
                try {
                    await this.vxAdminLogin({
                        account: this.forData.userName,
                        passWd: this.forData.password,
                    })
                    this.sending = false
                } catch (error) {
                    setTimeout(() => {
                        this.sending = false
                        Toast({ message: error.message })
                    }, 1500);
                }
                // 不允许back回来
                this.$router.replace({ name: 'users' })
            },
        },
        async mounted() {
            await this.$nextTick()
            this.$refs.userNameInput.focus()
        },
        beforeRouteEnter(to, from, next) {
            if (store.getters['admin/isLoggedIn']) {
                next({ name: 'users' })
            } else {
                next()
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../../../common_assets/basic_const';
    .sign-in-page {
        height: 100vh;
        .sign-in-card {
            width: 80%;
            max-width: 400px;
            position: relative;
            top: 50vh;
            margin: -170px auto 0;
            padding: 40px 20px 20px;
        }
        .submit-btn-line {
            text-align: center;
            margin-top: 40px;
        }
    }
</style>