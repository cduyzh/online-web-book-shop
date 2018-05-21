/**
 * Created by lnk on 2017/4/29.
 */
export default {
    methods: {
        // 设置窗口标题
        setDialogTitle(title) {
            this.$emit('set-title', title)
        },
        /**
         * 关闭窗口
         * @param {object?} closeBundle 传到弹框onClose回调中的对象。选填。比setCloseBundle设置的对象更优先
         * 注意onClose回调的参数是{dialogType:string, closeBundle:object?}
         */
        closeDialog(closeBundle) {
            if (closeBundle) {
                this.$emit('set-close-bundle', closeBundle)
            }
            this.$emit('complete')
        },
        // 提前设置closeBundle数据，在手动调用closeDialog或用户自己点右上角的叉关闭窗口时会将其传入onClose回调
        setCloseBundle(bundle) {
            this.$emit('set-close-bundle', bundle)
        }
    },
}
