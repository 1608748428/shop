import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入axios
import axios from 'axios'
// axios 请求拦截  保证拥有获取数据的权限
axios.interceptors.request.use((config) => {
  // 为请求头对象,添加 token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem(
    "token"
  );
  // 在最后必须 return config
  return config;
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
