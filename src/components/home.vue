<template>
  <div>
    <el-button type="info" @click="login">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      // 销毁token值
      window.sessionStorage.clear();
      // 重新跳转到登录页
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
</style>