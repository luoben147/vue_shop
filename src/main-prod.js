import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


//导入字体图标
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'


//导入 NProgress 进度条
import NProgress from 'nprogress'


import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'


//配置请求拦截器 携带token
//在 request 拦截器中，展示进度条
axios.interceptors.request.use(config => {
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})

// 在 response 拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
    NProgress.done()
    return config;
})


Vue.prototype.$http = axios;

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

//定义全局的 时间格式化过滤器
Vue.filter('dateFormat', function (originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + '').padStart(2, '0');
    const d = (dt.getDay() + '').padStart(2, '0');

    const hh = (dt.getHours() + '').padStart(2, '0');
    const mm = (dt.getMinutes() + '').padStart(2, '0');
    const ss = (dt.getSeconds() + '').padStart(2, '0');

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
