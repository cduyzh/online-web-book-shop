<template>
    <div class="home-content">
        <home-header></home-header>
        <Tabs>
            <TabPane label="首页" icon="home">
                <book-homepage></book-homepage>
            </TabPane>
            <TabPane label="书架" icon="ios-book">
                <bookshelf></bookshelf>
            </TabPane>
        </Tabs>
        <BackTop :height="50" :bottom="50"></BackTop>
    </div>
</template>

<script>
    import bookHomepage from './book_homepage/book_homepage.vue'
    import bookshelf from './bookshelf/bookshelf.vue'
    import homeHeader from './componets/home_header.vue'

    export default {
        name: 'home-content',
        data() {
            return {

            }
        },
        components: {
            bookHomepage,
            bookshelf,
            homeHeader
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .home-content {
        .ivu-tabs {
            width: 100vw;
        }
        .ivu-tabs-bar {
            background: #efeff0;
            height: 40px;
            margin-bottom: 0;
        }
        .ivu-tabs-nav {
            width: 100%;
            display: flex;
            height: 40px;
            justify-content: center;
            overflow: scroll;
        }
        .ivu-tabs-ink-bar {
            left: 50%;
            margin-left: -98px;
        }
        .ivu-tabs-tabpane {
            background: #f5f5f5;
        }
        .ivu-tabs-ink-bar {
            background-color: #777;
        }
        .ivu-tabs-nav .ivu-tabs-tab:hover {
            color: #ff6600;
        }
        .ivu-tabs-nav .ivu-tabs-tab:hover {
            color: #ff6600;
        }
        .ivu-tabs-nav .ivu-tabs-tab-active {
            color: #ff6600;
        }
    }
</style>