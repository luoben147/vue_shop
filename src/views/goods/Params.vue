<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!--警告区域-->
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon>
            </el-alert>

            <!--选择商品分类区域-->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!--选择商品分类的级联选择框-->
                    <el-cascader
                            v-model="selectedKeys"
                            :options="cateList"
                            :props="cateProps"
                            @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

            <!--tab页签区-->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!--添加动态参数的面板-->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini"
                               :disabled="isBtnDisable" @click="addDialogVisible=true">添加参数
                    </el-button>
                    <!--动态参数表格-->
                    <el-table :data="manyTableData" border stripe>
                        <!--展开行-->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!--循环渲染Tag标签-->
                                <el-tag v-for="(item,i) in scope.row.attr_vals"
                                        :key="i" closable
                                        @close="handleClose(i,scope.row)">
                                    {{item}}
                                </el-tag>

                                <!--New Tag-->
                                <!--输入文本框-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!--添加按钮-->
                                <el-button v-else class="button-new-tag" size="small"
                                           @click="showInput(scope.row)">
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <!--索引列-->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                           @click="showEditForm(scope.row.attr_id)">编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click="removeParams(scope.row.attr_id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!--添加静态属性的面板-->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini"
                               :disabled="isBtnDisable" @click="addDialogVisible=true">添加属性
                    </el-button>
                    <!--静态属性表格-->
                    <el-table :data="onlyTableData" border stripe>
                        <!--展开行-->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!--循环渲染Tag标签-->
                                <el-tag v-for="(item,i) in scope.row.attr_vals"
                                        :key="i" closable
                                        @close="handleClose(i,scope.row)">
                                    {{item}}
                                </el-tag>

                                <!--New Tag-->
                                <!--输入文本框-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!--添加按钮-->
                                <el-button v-else class="button-new-tag" size="small"
                                           @click="showInput(scope.row)">
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <!--索引列-->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                           @click="showEditForm(scope.row.attr_id)">编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click="removeParams(scope.row.attr_id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </el-card>

        <!--添加参数的对话框-->
        <el-dialog
                :title="'添加'+titleText"
                :visible.sync="addDialogVisible"
                width="30%" @close="addDialogClosed">
            <!--添加参数的表单-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Params",
        data() {
            return {
                //商品分类列表
                cateList: [],
                //级联选择框的配置对象
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                //级联选择框双向绑定的id数组
                selectedKeys: [],
                //被激活的tab页签的名称
                activeName: 'many',
                //动态参数的数据
                manyTableData: [],
                //静态参数的数据
                onlyTableData: [],
                //控制添加对话框的显示与隐藏
                addDialogVisible: false,
                //添加参数的表单数据对象
                addForm: {
                    attr_id: -1,
                    attr_name: "",
                    cat_id: '',
                    attr_sel: "",
                    attr_write: "",
                    attr_vals: ""
                },
                //添加表单的验证规则对象
                addFormRules: {
                    attr_name: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'},
                    ]
                }
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            //获取所有商品分类列表
            getCateList() {
                this.$http.get('/categories').then(({data: res}) => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取商品分类失败')
                    }
                    this.cateList = res.data
                })
            },
            //级联选择框选中项变化，会触发这个函数
            handleChange() {
                this.getParamsData()
            },
            //tab页签 点击事件的处理函数
            handleTabClick(tab, event) {
                this.getParamsData();
            },
            //获取参数的列表数据
            getParamsData() {
                //选择的不是3级分类
                if (this.selectedKeys.length !== 3) {
                    this.selectedKeys = []
                    this.manyTableData = []
                    this.onlyTableData = []
                    return
                }
                //选中的是三级分类
                //根据所选分类的id，和当前所处的面板，获取对应的参数
                this.$http.get(`categories/${this.cateId}/attributes`, {
                    params:
                        {sel: this.activeName}
                }).then(({data: res}) => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取参数列表失败')
                    }

                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []

                        //控制文本框的显示与隐藏
                        item.inputVisible=false
                        //文本框中输入的值
                        item.inputValue=''

                    })
                    console.log(res.data)

                    if (this.activeName === 'many') {
                        this.manyTableData = res.data
                    } else {
                        this.onlyTableData = res.data
                    }
                })
            },
            //监听添加对话框的关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
                this.resetAddFrom();
            },
            //添加参数
            addParams() {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) return
                    if (this.addForm.attr_id === -1) {//新增
                        this.$http.post(`categories/${this.cateId}/attributes`, {
                            attr_name: this.addForm.attr_name,
                            attr_sel: this.activeName
                        }).then(({data: res}) => {
                            if (res.meta.status !== 201) {
                                return this.$message.error('添加参数失败')
                            }
                            this.$message.success('添加参数成功')
                            this.addDialogVisible = false
                            this.getParamsData()
                        })
                    } else {//修改
                        this.$http.put(`categories/${this.cateId}/attributes/` + this.addForm.attr_id, {
                            attr_name: this.addForm.attr_name,
                            attr_sel: this.activeName
                        }).then(({data: res}) => {
                            if (res.meta.status !== 200) {
                                return this.$message.error('修改参数失败')
                            }
                            this.$message.success('修改参数成功')
                            this.addDialogVisible = false
                            this.getParamsData()
                        })
                    }
                })
            },
            resetAddFrom() {
                this.addForm.attr_id = -1
                this.addForm.attr_name = ""
                this.addForm.cat_id = ''
                this.addForm.attr_sel = ""
                this.addForm.attr_write = ""
                this.addForm.attr_vals = ""
            },
            //修改参数
            showEditForm(attr_id) {
                this.$http.get(`categories/${this.cateId}/attributes/` + attr_id, {
                    params: {
                        attr_sel: this.activeName
                    }
                }).then(({data: res}) => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取参数信息失败！')
                    }
                    this.addForm.attr_id = attr_id;
                    this.addForm.attr_name = res.data.attr_name;
                    this.addForm.cat_id = res.data.cat_id;
                    this.addForm.attr_sel = res.data.attr_sel;
                    this.addForm.attr_write = res.data.attr_write;
                    this.addForm.attr_vals = res.data.attr_vals;
                    this.addDialogVisible = true;
                });
            },
            //删除参数
            removeParams(attr_id) {
                this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(`categories/${this.cateId}/attributes/` + attr_id).then(({data}) => {

                        if (data.meta.status !== 200) {
                            return this.$message.error('删除参数失败')
                        }
                        this.$message.success('删除参数成功')
                        this.getParamsData()
                    })
                }).catch((err) => {
                    this.$message.info('已取消删除');
                    return err;
                });
            },
            //文本框失去焦点或按下Enter键都会触发
            handleInputConfirm(row){
                if(row.inputValue.trim().length===0){
                    row.inputValue = ''
                    row.inputVisible=false
                    return
                }
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible=false
                //发起请求保存到后台
                this.saveAttrVals(row)
            },
            //将对attr_vals 的操作保存到数据库
            saveAttrVals(row){
                //发起请求保存到后台
                this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                    attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join(' ')
                }).then(({data:res})=>{
                    if(res.meta.status!=200){
                        return this.$message.error('修改参数项失败！')
                    }
                    this.$message.success('修改参数项成功！')
                })
            },
            //点击按钮，展示文本输入框
            showInput(row){
                row.inputVisible=true
                //让文本框自动获取焦点
                //$nextTick 作用： 当页面上元素被重新渲染之后，才会指定回调函数中的代码
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //删除对应的参数可选项
            handleClose(i,row){
                row.attr_vals.splice(i,1)
                this.saveAttrVals(row)
            }
        },
        computed: {
            //tab面板按钮 需要禁用返回true
            isBtnDisable() {
                if (this.selectedKeys.length !== 3) {
                    return true
                }
                return false
            },
            //当前选中的三级分类的id
            cateId() {
                if (this.selectedKeys.length === 3) {
                    return this.selectedKeys[2]
                }
                return null
            },
            //添加参数对话框的标题文本
            titleText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                }
                return '静态属性'
            }
        }
    }
</script>

<style scoped>
    .cat_opt {
        margin: 15px 0;
    }

    .el-tag {
        margin: 5px;
    }
    .input-new-tag{
        width: 120px;
    }
</style>
