<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <!--搜索与添加区-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!--用户列表区-->
            <el-table :data="userlist" border stripe row-key="id">
                <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="showEditDialog(scope.row.id)"></el-button>
                        <!--删除按钮-->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="rmvUserById(scope.row.id)"></el-button>
                        <!--分类角色按钮-->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting"
                                       size="mini"
                                       @click="setRole(scope.row)"></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>
            <!--分页区-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--添加用户的对话框-->
        <el-dialog
                :title="this.addForm.id===-1? '添加用户':'修改用户'"
                :visible.sync="addDialogVisible"
                width="50%" @closed="addDialogClosed">
            <!--内容主体区-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username" :disabled="this.addForm.id!==-1"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="this.addForm.id===-1">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>



        <!--分配角色对话框-->
        <el-dialog
                title="分配角色"
                :visible.sync="setRoleDialogVisible"
                width="50%"
                @close="setRoleDialogClosed"
                >
            <div>
                <p>当前用户：{{userInfo.username}}</p>
                <p>当前角色：{{userInfo.role_name}}</p>
                <p>分配新角色：
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                                v-for="item in rolesList"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="setRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Users",
        data() {
            //自定义验证邮箱的规则
            var checkEmail = (rule, value, callback) => {
                //验证邮箱的正则
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
                if (regEmail.test(value)) {
                    //合法邮箱
                    return callback()
                }
                callback(new Error('请输入合法的邮箱'))
            };
            //验证手机的规则
            var checkMobile = (rule, value, callback) => {
                //验证手机号的正则
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                if (regMobile.test(value)) {
                    return callback()
                }
                callback(new Error('请输入合法的手机号'))
            };
            return {
                //获取用户列表的参数对象
                queryInfo: {
                    query: '',
                    //当前页数
                    pagenum: 1,
                    //当前每页显示多少条
                    pagesize: 2
                },
                userlist: [],
                total: 0,
                //控制添加用户对话框的显示与隐藏
                addDialogVisible: false,
                //添加用户的表单数据
                addForm: {
                    id: -1,
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                    mg_state: false,
                    role_name: ''
                },
                //添加表单验证规则对象
                addFormRules: {
                    username: [
                        //trigger 表示是什么事件触发
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '用户名长度在3~10字符之间', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '用户名长度在6~15字符之间', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },
                //控制分配角色对话框的显示与隐藏
                setRoleDialogVisible:false,
                //需要被分配角色的用户信息
                userInfo:{},
                //所有角色的数据列表
                rolesList:[],
                //已选中的角色Id
                selectedRoleId:''
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                const {data: res} = await this.$http.get('users', {params: this.queryInfo})
                //console.log(res)
                if (res.meta.status !== 200) return this.$message.error("获取用户列表失败")
                this.userlist = res.data.users;
                this.total = res.data.total;
            },
            //监听 pagesize 改变的事件
            handleSizeChange(newSize) {
                //console.log(`每页 ${newSize} 条`);
                this.queryInfo.pagesize = newSize;
                this.getUserList()
            },
            //监听 页码值 改变的事件
            handleCurrentChange(newPage) {
                //console.log(`当前页: ${newPage}`);
                this.queryInfo.pagenum = newPage;
                this.getUserList()
            },
            //监听 switch 开关状态的改变
            async userStateChanged(row) {
                const {data: res} = await this.$http.put(`/users/${row.id}/state/${row.mg_state}`)
                if (res.meta.status !== 200) {
                    row.mg_state = !row.mg_state
                    return this.$message.error('更新用户状态失败')
                }
                this.$message.success('更新用户状态成功')
            },
            //监听添加用户 对话框的关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields();
                this.resetAddFrom();

            },
            resetAddFrom() {
                this.addForm.id = -1;
                this.addForm.username = '';
                this.addForm.email = ''
                this.addForm.mobile = '';
                this.addForm.mg_state = false;
                this.addForm.role_name = '';
            },
            //点击按钮，添加新用户
            addUser() {
                this.$refs.addFormRef.validate(async (valid) => {
                    if (!valid) return;
                    //发起添加用户的网络请求
                    if (this.addForm.id === -1) { //新增
                        const {data: res} = await this.$http.post('/users', this.addForm)
                        if (res.meta.status !== 201) {
                            this.$message.error('添加用户失败!')
                        }
                        this.$message.success('添加用户成功!')
                        //隐藏添加用户的对话框
                        this.addDialogVisible = false;
                        //重新获取用户列表
                        this.getUserList()
                    } else { //修改
                        this.$http.put('/users/' + this.addForm.id, {
                            email: this.addForm.email,
                            mobile: this.addForm.mobile
                        }).then(({data}) => {
                            if (data.meta.status !== 200) {
                                this.$message.error('更新用户失败!')
                            }
                            this.$message.success('更新用户成功!')
                            //隐藏添加用户的对话框
                            this.addDialogVisible = false;
                            //重新获取用户列表
                            this.getUserList()
                        })
                    }
                })
            },
            //展示编辑用户对话框
            async showEditDialog(id) {
                const {data: res} = await this.$http.get('/users/' + id);
                if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
                this.addForm.id = id;
                this.addForm.username = res.data.username;
                this.addForm.email = res.data.email;
                this.addForm.mobile = res.data.mobile;
                this.addDialogVisible = true;
            },
            //根据id删除对应的用户信息
            rmvUserById(id) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('/users/' + id).then(({data}) => {

                        if (data.meta.status !== 200) {
                            return this.$message.error('删除用户失败')
                        }
                        this.$message.success('删除用户成功')
                        this.getUserList()
                    })
                }).catch((err) => {
                    this.$message.info('已取消删除');
                });
            },

            //展示分配角色对话框
            setRole(userInfo){
                this.userInfo=userInfo;
                //获取所有角色列表
                this.$http.get('/roles').then(({data})=>{
                    if (data.meta.status !== 200) {
                        return this.$message.error('获取角色失败')
                    }
                    this.rolesList=data.data;
                })


                this.setRoleDialogVisible=true
            },
            //点击按钮，分配角色
            saveRoleInfo(){
                if(!this.selectedRoleId){
                    return this.$message.error('请选择要分配的角色')
                }

                this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId}).then(({data})=>{
                    if (data.meta.status !== 200) {
                        return this.$message.error('更新用户角色失败')
                    }
                    this.$message.success('更新用户角色成功')
                    this.getUserList()
                    this.setRoleDialogVisible=false
                })
            },
            //监听分配角色对话框的关闭事件
            setRoleDialogClosed(){
                this.selectedRoleId=''
                this.userInfo={}
            }

        }
    }
</script>

<style scoped>

</style>
