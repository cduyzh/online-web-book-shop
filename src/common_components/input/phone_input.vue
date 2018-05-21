<template>
    <limit-input ref="input"
                 class="phone-input"
                 :label="label"
                 :max-length="maxLength"
                 :is-required="isRequired"
                 :validator="inputValidator"
                 :invalid-filter="inputInvalidFilter"
                 v-model="phone"
                 @press-enter="onPressEnter">
    </limit-input>
</template>

<script type="text/babel">
    import limitInput from './limit_input.vue'; // 输入数据合法性改变的事件 const VALID_CHANGED = 'valid-changed'; // 用户敲回车的事件 const PRESS_ENTER = 'press-enter'; export default { props: { /** 该输入框的名字，会显示在placeholder中 */ label: { type: String, default: '请输入手机号' }, //
    父元素可以通过它改变输入框中的值 value: { type: String, default: '' }, isRequired: { type: Boolean, default: false }, }, data() { return { phone: this.value, // 手机号的校验器。允许输入外国手机，采用宽松的输入限制 inputValidator: /^\d{7,}$/, // 输入数据中不合法字符的过滤器 inputInvalidFilter: /[^\d]/g,
    isValid: false, maxLength: 20, } }, components: { limitInput, }, methods: { onPressEnter() { this.$emit(PRESS_ENTER, event); }, }, watch: { value(newValue) { if (this.phone !== newValue) { this.phone = newValue } }, phone(newValue) { this.$emit('input',
    newValue); this.isValid = this.$refs.input.isValid; }, isValid(newValue) { this.$emit(VALID_CHANGED, newValue); }, }, mounted() { this.$nextTick(() => { // 收集初始数据 this.isValid = this.$refs.input.isValid; }) } };
</script>

<style lang="scss" rel="stylesheet/scss">
    .phone-input {}
</style>