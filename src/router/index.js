import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录页面组件
import login from '../components/login.vue'
// 导入 home页面组件
import home from '../components/home.vue'

Vue.use(VueRouter)

// 实例化路由对象
const router = new VueRouter({
  routes: [
    //配置组件和地址的关系
    // 默认进来跳转到登录界面
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home
    }

  ]
})



// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //   next()  放行      next('/login')  强制跳转的页面

  // 如果用户访问的是登录也，直接放行
  if (to.path === '/login') return next()
  // 从 sessionStorage 中获取到 保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token');
  // 没有 token, 强制跳转到登录页
  if (!tokenStr) return next('/login')
  // 有token  直接放行
  next()
})


// 把这个路由对外扩散
export default router