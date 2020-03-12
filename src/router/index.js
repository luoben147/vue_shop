import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../views/Login'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../views/Login.vue')
// import Home from '../views/Home'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../views/Home.vue')
// import Welcome from '../views/Welcome'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../views/Welcome.vue')

// import Users from '../views/user/Users'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/user/Users.vue')
// import Rights from '../views/power/Rights'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/power/Rights.vue')
// import Roles from '../views/power/Roles'
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/power/Roles.vue')


// import Cate from '../views/goods/Cate'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../views/goods/Cate.vue')
// import Params from '../views/goods/Params'
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../views/goods/Params.vue')


// import List from '../views/goods/List'
const List = () => import(/* webpackChunkName: "List_Add" */ '../views/goods/List.vue')
// import Add from '../views/goods/Add'
const Add = () => import(/* webpackChunkName: "List_Add" */ '../views/goods/Add.vue')


// import Order from '../views/order/Order'
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../views/order/Order.vue')
// import Report from '../views/report/Report'
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../views/report/Report.vue')



Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect:'/welcome',
        children: [
            {path: '/welcome', component: Welcome},
            {path: '/users', component: Users},
            {path: '/rights', component: Rights},
            {path: '/roles', component: Roles},
            {path:'/categories',component:Cate},
            {path:'/params',component:Params},
            {path:'/goods',component:List},
            {path:'/goods/add',component:Add},
            {path:'/orders',component:Order},
            {path:'/reports',component:Report}
        ]
    }
]

const router = new VueRouter({
    routes
})

//挂载路由全局导航守卫
//前端控制是否登录
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    //获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();
})

export default router
