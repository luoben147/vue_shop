import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

//挂载路由全局导航守卫
//前端控制是否登录
router.beforeEach((to,from,next)=>{
    if(to.path==='/login') return next();
    //获取token
    const tokenStr=window.sessionStorage.getItem('token');
    if(!tokenStr) return next('/login');
    next();
})

export default router
