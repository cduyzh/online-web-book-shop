<template>
    <div class="main-page">
        <Menu class="side-menu" theme="light" :active-name="activeName" @on-select="jumpTo">
            <Submenu name="link-submenu">
                <template slot="title">用户</template>
<MenuItem name="users">所有用户</MenuItem>
</Submenu>
</Menu>
<router-view class="main-content"></router-view>
</div>
</template>

<script>
    export default {
        name: 'main-page',
        data() {
            return {};
        },
        computed: {
            activeName() {
                return this.$route.name
            },
        },
        methods: {
            jumpTo(name) {
                this.$router.push({ name })
            },
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../../common_assets/basic_const';
    .main-page {
        display: flex;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        .side-menu {
            flex-shrink: 0;
        }
        .main-content {
            flex-grow: 1;
            width: 100%;
            overflow: auto;
        }
    }
</style>