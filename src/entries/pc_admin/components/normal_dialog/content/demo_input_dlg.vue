<template>
    <div class="demo-input-dlg">
        <p class="dlg-tips">
            Please leave a message below,<br>
            nobody will see it!
        </p>
        <textarea :placeholder="dialogData.placeholder"
                  v-model.trim="userInput"
                  :class="{invalid:showWarning&&!userInput}"></textarea>
        <p class="dlg-tips">
            Tips:<br>
            1.Leave message is free.<br>
            2.Please make sure you understand what you wrote.
        </p>
        <div class="bottom-buttons">
            <button class="bottom-button no-highlight" :disabled="submitting" @click="submit">
                Confirm
            </button>
        </div>
    </div>
</template>

<script>
    import {checkParams} from 'common_libs/util'
    import contentMixin from '../dialog_content_mixin'

    export default {
        name: 'demo-input-dlg',
        mixins: [contentMixin],
        props: {
            dialogData: {
                type: Object,
                required: true,
                validator: data => checkParams(data, {
                    placeholder: 'string', // 显示在输入框里的提示文字
                }, 'dialogData')
            },
        },
        data() {
            return {
                // 弹框上的输入数据
                userInput: '',
                // 是否正在发送提交请求
                submitting: false,
                // 是否标红
                showWarning: false,
            };
        },
        methods: {
            async submit() {
                this.showWarning = true
                if (!this.userInput) {
                    return
                }

                this.submitting = true
                try {
                    await this.fakePost({
                        msg: this.userInput,
                    })
                } catch (e) {
                    // 发包成功不用隐藏菊花，以免关闭弹框的动画中又点到了提交按钮
                    this.submitting = false
                    return
                }
                this.closeDialog({isSigndeUp: true})
                this.$Message.success('Success!')
            },
            fakePost(data) {
                console.log('post data', data)
                return new Promise(resolve => setTimeout(resolve, 2000))
            }
        },
        mounted() {
            this.setDialogTitle('Demo input')
        },
    }
</script>


<style lang="scss" rel="stylesheet/scss">
    @import "../../../../../common_assets/basic_const";

    .demo-input-dlg {
        padding-top: 15px;
        .dlg-tips {
            font-size: 13px;
            color: #7c7c7c;
            margin: 10px 15px;
            line-height: 130%;
        }
        textarea {
            height: 150px;
            &.invalid {
                border-color: $basic-warning;
            }
        }
    }
</style>
