<template>
  <el-container class="home">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/avaral.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="login">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左边导航栏 -->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="gottle_btn" @click="toggleCollapse">{{arrow}}</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="iscollapse"
          :collapse-transition="false"
          router
          :default-active='activePath'
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in listnav" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="listicon[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二次菜单 -->
            <el-menu-item :index= "'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveNavStart('/' + subitem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      //存放左侧导航栏数据
      listnav: [],
      //导航栏的一级菜单图标
      listicon:{
        125:'el-icon-user-solid',
        103:'el-icon-coin',
        101:'el-icon-s-goods',
        102:'el-icon-s-cooperation',
        145:'el-icon-s-data'
      },
      // 是否水平折叠收起菜单
      iscollapse:false,
      // 折叠导航栏显示的图标
      arrow:'<',
      // 当前激活菜单的index
      activePath:''
    };
  },
  created() {
    this.getListmenus();
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    login() {
      // 销毁token值
      window.sessionStorage.clear();
      // 重新跳转到登录页
      this.$router.push("/login");
    },
    getListmenus() {
      axios({
        url: "http://127.0.0.1:8888/api/private/v1/menus",
        method: "get",
      }).then((res) => {
        if (res.data.meta.status === 200) {
          this.listnav = res.data.data;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    // 点击是否折叠的方法
    toggleCollapse() {
      this.iscollapse = !this.iscollapse;
      if(this.iscollapse === true)
      {
        this.arrow = '>'
      } else {
        this.arrow = '<'
      }
    },
    // 获取当前点击的二次菜单 保存链接的激活状态
    saveNavStart(activePath) {
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath = activePath;
    }
  },
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
}
// 头部区域
.el-header {
  background-color: #424242;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  font-size: 20px;
  color: #ffffff;
  > div {
    display: flex;
    align-items: center;
  }
}
// 左侧导航栏
.el-aside {
  background-color: #545c64;
  .el-menu {
    border: 0;
  }
}
// 是否折叠导航栏
.gottle_btn {
  background-color: #495265;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
}
// 主体区域
.el-main {
  background-color: #d8d8d8;
}
</style>