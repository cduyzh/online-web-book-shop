<template>
    <div class="home-index">
        <router-view></router-view>

    </div>
</template>

<script>
    export default {
        name: 'home-index',
        data() {
            return {

            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../../../common_assets/animation';
    @import '../../assets/scss/common.scss';
    @import '../../assets/fonts/iconfont/iconfont.css';
    .home-index {
        height: 100%;
    }
</style>