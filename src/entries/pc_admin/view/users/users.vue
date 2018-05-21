<template>
    <div class="admin-user">
        <h1>用户列表页面</h1>
        <div class="result-table">
            <i-table ref="table" stripe :loading="loading" height="680" border :columns="columnData" :data="vxUserList"></i-table>
            <br>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex'
    import store from '../../store'

    const OPTION_BUTTON_TYPES = ['刪除']

    export default {
        name: 'admin-user',
        data() {
            return {
                loading: false,
                // Table Render
                columnData: [{
                    title: '用户名',
                    key: 'userName',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '章节券',
                    key: 'assetChapter',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '金币',
                    key: 'assetCoin',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '邮箱',
                    key: 'email',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '注册时间',
                    key: 'time',
                    width: 200,
                    align: 'center',
                    sortable: true
                },
                {
                    title: '操作',
                    key: 'option',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', this.handleOpButtons(h, params))
                    }
                }
                ],
                // Table List
                // tableDataList: [{
                //     userName: '123',
                //     email: '123123',
                //     time: Date.now(),
                //     assetChapter: 1, // 章节券
                //     assetCoin: 11 // 金币
                // }],
                tableDataList: []
            }
        },
        computed: {
            ...mapState({
                vxUserList: state => state.admin.userList,
                vxAdminAccount: state => state.admin.adminAccount,
            })
        },
        methods: {
            ...mapActions({
                vxGetAllusers: 'admin/getAllusers',
                vxRemoveUser: 'admin/removeUser'
            }),
            handleOpButtons(h, params) {
                const getOpButtons = []
                OPTION_BUTTON_TYPES.forEach(item => {
                    const opButton = h(
                        'Button', {
                            props: {
                                type: 'error',
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.handleOp(params.row, item)
                                }
                            }
                        },
                        item
                    )
                    getOpButtons.push(opButton)
                })
                return getOpButtons
            },
            async handleOp(tableItemObj, operation) {
                console.log(tableItemObj.email, operation);
                try {
                    await this.vxRemoveUser({account: this.vxAdminAccount, email: tableItemObj.email})
                    this.$Notice.success({
                        title: '操作成功',
                        desc: '删除用户成功'
                    })
                } catch (error) {
                    this.$Notice.error({
                        title: '操作失败',
                        desc: error.message
                    })
                }
                this.loading = true
                this.refreshData()
            },
            async refreshData() {
                try {
                    await this.vxGetAllusers()
                } catch (error) {
                    this.loading = false
                }
                setTimeout(() => {
                    this.loading = false
                }, 1500);
            }
        },
        mounted() {
            this.loading = true
            this.refreshData()
        },
        beforeRouteEnter(to, from, next) {
            if (store.getters['admin/isLoggedIn']) {
                next()
            } else {
                next({name: 'login'})
            }
        },
    }
</script>
<style lang="scss">
    .admin-user {
        padding: 0 20px;
        h1 {
            margin: 50px auto;
        }
    }
</style>