<template>
    <el-container class="home-container">
        <!--头部区-->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!--主体区-->
        <el-container>
            <!--侧边栏-->
            <el-aside :width="isCollapse ? '64px':'200px' ">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!--侧边栏菜单区-->
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409EFF"
                        unique-opened
                        :collapse="isCollapse"
                        :collapse-transition="false"
                        :router="true"
                        :default-active="this.$route.path">
                    <!--一级菜单-->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <!--一级菜单模板区-->
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item :index="'/'+subItem.path"
                                      v-for="subItem in item.children"
                                      :key="subItem.id">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>

            </el-aside>
            <!--右侧内容-->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                //左侧菜单数据
                menuList: [],
                iconsObj: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                //是否折叠菜单
                isCollapse: false,
            }
        },
        created() {
            this.getMenuList()
        },
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login');
            },
            //获取所有菜单
            async getMenuList() {
                const {data: res} = await this.$http.get('/menus');
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.menuList = res.data
            },
            //切换菜单的 折叠/展开
            toggleCollapse() {
                this.isCollapse = !this.isCollapse;
            },

        }
    }
</script>

<style scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #373D41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: white;
        font-size: 20px;
    }


    .el-header div {
        display: flex;
        align-items: center;
    }

    .el-header div img {
        width: 60px;
        height: 60px;
        margin: 5px;
    }

    .el-header div span {
        margin-left: 15px;
    }


    .el-aside {
        background-color: #333744;
    }

    .el-menu {
        border-right: none;
    }

    .el-main {
        background-color: #EAEDF1;
    }

    .iconfont {
        margin-right: 10px;
    }

    .toggle-button {
        background-color: #4A5064;
        font-size: 10px;
        line-height: 24px;
        color: white;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }

</style>
