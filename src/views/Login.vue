<template>
    <div class="login">
        <div class="login_box">
            <!--头像区-->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!--登陆表单区-->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!--用户名-->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username"
                              prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password"
                              prefix-icon="iconfont icon-3702mima"
                              type="password"></el-input>
                </el-form-item>
                <!--按钮区-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                //登陆表单的数据绑定对象
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                //表单验证规则对象
                loginFormRules:{
                    //验证用户名是否合法
                    username:[
                        { required: true, message: '请输入登陆名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    //验证密码是否合法
                    password:[
                        { required: true, message: '请输入登陆密码', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            //点击重置按钮，重置登录表单
            resetLoginForm(){
                this.$refs.loginFormRef.resetFields();
            },
            login(){
                // this.$refs.loginFormRef.validate((valid) =>{
                //     if(!valid) return;
                //     this.$http.post('login',this.loginForm).then(res =>{
                //         console.log(res)
                //     }).catch(err=>{
                //         console.log(err.toString())
                //     });
                // })

                //post返回值Promise 使用async/await 简化返回值
                this.$refs.loginFormRef.validate(async (valid)=>{
                    //验证返回值 valid
                    if(!valid) return;
                    const {data:res}=await this.$http.post('login',this.loginForm);
                    if(res.meta.status!==200) return this.$message.error('登录失败!')
                    this.$message.success('登录成功!')
                    //1.将登陆成功后的token保存到客户端sessionStorage
                    //  1.1 项目中除了登录之外的其他api接口，必须登录之后才能访问
                    //  1.2 token只应在当前网站打开期间有效，所有将token保存在sessionStorage
                    window.sessionStorage.setItem("token",res.data.token)
                    //2.通过编程式导航跳转到后台主页 '/home'
                    this.$router.push('/home')
                })

            }
        }
    }
</script>

<style scoped>
    .login {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .avatar_box {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
    }

    .avatar_box img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>
