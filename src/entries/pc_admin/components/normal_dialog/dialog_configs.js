/**
 * 对话框id
 */
export const DialogType = {
    NONE: '0',
    LOADING: '1',
    // 测试用的框
    DEMO_INPUT: '101',
}

/**
 * 弹框样式
 */
export const DialogStyle = {
    TITLE_AT_MIDDLE: 'middle-title-dialog',
}

/**
 * 弹框配置
 * {number} type DialogType
 * {Function} loader 按需加载弹框内容的方法，同一模块下的弹框最好使用相同的trunk，一起加载
 * {string} dialogClass 弹框样式，默认为DialogStyle.TITLE_AT_MIDDLE
 * {boolean} closeOnClickOutside 是否在点击窗口以外区域或按下ESC时关闭窗口，默认不关闭
 * {boolean} lockScroll 是否锁定滚动条。ios上有输入框的页面会在输入文字时出现光标飞走的现象，去掉背景滚动条后问题解决
 */
export const componentConfigs = [{
    // 测试用的框
    type: DialogType.DEMO_INPUT,
    loader: () => import(/* webpackChunkName: "events_dlg_demo_input" */'./content/demo_input_dlg.vue'),
}]
