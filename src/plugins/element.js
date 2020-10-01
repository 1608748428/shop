import Vue from 'vue'
import {
    Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox 
} from 'element-ui'

// 登录界面
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 头部区域
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
// 左边导航栏
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
// 用户列表
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
// 只要使用this 就可以全局调用这个消息提示弹框
Vue.prototype.$message = Message
// 只要使用this 就可以全局调用这个弹框
Vue.prototype.$confirm = MessageBox.confirm