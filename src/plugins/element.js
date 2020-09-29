import Vue from 'vue'
import { Button,Form,FormItem,Input,Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 只要使用this 就可以全局调用这个消息提示弹框
Vue.prototype.$message = Message
