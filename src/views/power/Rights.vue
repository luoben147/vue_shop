<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图-->
        <el-card>
            <el-table :data="rightsList" border stripe :max-height="getTabHeight">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level==='0'">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
    export default {
        name: "Rights",
        data() {
            return {
                //权限列表
                rightsList: [],
                screenHeight: document.documentElement.clientHeight,//屏幕高度
            }
        },
        created() {
            this.getRightsList();
        },
        mounted(){
            //监听窗口大小变化
            window.onresize = () => {
                return (() => {
                    this.screenHeight = document.body.clientHeight;
                })();
            };
        },
        computed:{
          getTabHeight(){
              return this.screenHeight -60- 130;
          }
        },
        methods: {
            //获取所有的权限列表
            getRightsList() {
                this.$http.get('/rights/list').then(({data}) => {
                    if(data.meta.status!==200){
                        return this.$message.error('获取权限列表失败！')
                    }

                    this.rightsList=data.data
                })
            }
        }
    }
</script>

<style scoped>

</style>
