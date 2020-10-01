<template>
  <div class="login">
    <!-- 登录框 -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avaral_box">
        <img src="../assets/avaral.png" alt="" />
      </div>
      <!-- 登录表单区域 :model后面定义的对象，会将表单里的数据都存放到里面   :rules 表单校验规则  ref 创建一个表单的实例对象-->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-s-custom"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入axios
import axios from "axios";

export default {
  data() {
    return {
      // 这是登录表单输入的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 点击重置按钮 重置登录表单
    resetLoginForm() {
      // 使用表单的实例对象去调用重置表单的方法
      this.$refs.loginFormRef.resetFields();
    },
    // 点击登录按钮 对表单输入的数据进行验证
    login() {
      this.$refs.loginFormRef.validate((val) => {
        if (val) {

          // axios访问登录界面的API
          axios({
            url: "http://127.0.0.1:8888/api/private/v1/login",
            method: "post",
            params: this.loginForm,
          }).then((res) => {
            if ((res.data.meta.status = 200)) {
              this.$message.success("登录成功！");
              // 1.将登录成功之后的token，保存到客户端的sessionStorage中
              //    1.1 项目中出了登录之外的其他API接口,必须在登录之后才能访问
              //    1.2 token只应在当前网站打开期间生效,所以将 token 保存在 sessionStorage 中
              window.sessionStorage.setItem("token", res.data.data.token);
              // 2. 通过编程式导航跳转到后台主页，路由地址时 /home
              this.$router.push("/home");
            } else {
              this.$message.error("登录失败！");
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: #023b61;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avaral_box {
  width: 100px;
  height: 100px;
  border: 1px solid #eeeeee;
  border-radius: 60px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
  box-shadow: 0 0 10px #333333;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #ffffff;
  }
}
// 登录表单
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
// 按钮
.btn {
  display: flex;
  justify-content: flex-end;
}
</style>