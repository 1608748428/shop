<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户卡片区域 -->
    <el-card>
      <!-- 用户搜索和添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="usersData.query"
            clearable
            @clear="seachuserData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="seachuserData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border style="width: 100%" stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽  slot-scope 可以获取当前作用域里面的数据(当前整个行的数据) -->
          <template slot-scope="scope">
            <!-- 当前行的数据 -->
            <!-- {{scope.row}} -->
            <!-- 开关  将当前的状态值赋值给v-model -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userListChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 修改用户按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除用户按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteDialog(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-s-help"
                size="mini"
                @click="assignroles(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersData.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="usersData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户区域 对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户区域 对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="alterDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="alterForm"
        :rules="alterFormRules"
        ref="alterFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="alterForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="alterForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="alterForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="alterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alterDialogVisibles(alterForm.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="rolesDialogVisible" width="50%">
      <div>
        <p>当前的用户:{{ userLists.username }}</p>
        <p>当前的角色:{{ userLists.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="newroles" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRolesInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
//导入axios
import axios from "axios";

export default {
  data() {
    // 自定义验证邮箱的校验规则
    var checkemail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      // 邮箱验证通过
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback();
      }
      // 邮箱验证错误
      return callback(new Error("请输入合法的邮箱"));
    };

    //自定义验证手机号的校验规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      // 手机号验证通过
      if (regMobile.test(value)) {
        // 合法的手机号
        return callback();
      }
      // 手机号验证错误
      return callback(new Error("请输入合法的手机号"));
    };

    return {
      // 传递的参数
      usersData: {
        // 搜索的数值
        query: "",
        // 当前显示的页码值
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      // 用户列表数据
      userList: [],
      // 总条数
      total: 0,
      // 添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户表单对象
      addForm: {
        // 用户名
        username: "",
        // 密码
        password: "",
        // 邮箱
        email: "",
        // 手机号
        mobile: "",
      },
      // 添加用户表单对象校验规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "用户名长度在3~8个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码的长度在6~15个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 修改用户对话框的显示与隐藏
      alterDialogVisible: false,
      // 修改用户表单对象
      alterForm: {
        // 用户名id
        id: "",
        // 用户名
        username: "",
        // 邮箱
        email: "",
        // 手机号
        mobile: "",
      },
      // 修改用户表单对象校验规则
      alterFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 分配角色对话框的显示与隐藏
      rolesDialogVisible: false,
      // 当前选中行的用户信息
      userLists: {},
      // 角色信息
      rolesList: [],
      // 选中的角色
      newroles: "",
    };
  },
  created() {
    this.getusersData();
  },
  methods: {
    getusersData() {
      axios({
        url: "http://127.0.0.1:8888/api/private/v1/users",
        method: "get",
        params: this.usersData,
      }).then((res) => {
        if (res.data.meta.status === 200) {
          // 用户数据
          this.userList = res.data.data.users;
          // 总条数
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    // 监听 选择一页显示多少条数据的改变
    handleSizeChange(sizelist) {
      this.usersData.pagesize = sizelist;
      this.getusersData();
    },
    // 监听 页码值的改变
    handleCurrentChange(currentlist) {
      this.usersData.pagenum = currentlist;
      this.getusersData();
    },
    // 监听 switch 用户状态开关是否发生改变
    userListChange(userinfo) {
      //调用axios 修改后台数据库的状态值
      axios({
        url: `http://127.0.0.1:8888/api/private/v1/users/${userinfo.id}/state/${userinfo.mg_state}`,
        method: "put",
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          this.$message.error("更新用户状态失败,请联系管理员！");
        }
        this.$message.success("更新用户状态成功！");
      });
    },
    // 搜索功能
    seachuserData() {
      this.getusersData();
      this.pagenum = 1;
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮  添加用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid === true) {
          axios({
            url: "http://127.0.0.1:8888/api/private/v1/users",
            method: "post",
            data: this.addForm,
          }).then((res) => {
            if (res.data.meta.status === 201) {
              this.$message.success("用户添加成功！");
              // 隐藏添加用户的对话框
              this.addDialogVisible = false;
              // 重新获取用户列表的数据
              this.getusersData();
            } else {
              this.$message.error("用户添加失败,请联系管理员！");
            }
          });
        }
      });
    },
    // 修改用户成功后关闭对话框
    alterDialogVisibles(alterUserId) {
      this.$refs.alterFormRef.validate((valid) => {
        if (valid === true) {
          axios({
            url: `http://127.0.0.1:8888/api/private/v1/users/${alterUserId}`,
            method: "put",
            data: {
              // 传入修改的值  邮箱  手机号
              email: this.alterForm.email,
              mobile: this.alterForm.mobile,
            },
          }).then((res) => {
            if (res.data.meta.status === 200) {
              // 将修改后的用户信息赋值给用户列表信息
              this.$message.success("用户信息修改成功！");
              // 用户信息修改成功后隐藏对话框
              this.alterDialogVisible = false;
              // 重新获取用户列表信息
              this.getusersData();
            } else {
              this.$message.error("用户信息修改失败,请联系管理员！");
            }
          });
        }
      });
    },
    // 点击按钮 显示修改用户的对话框
    showEditDialog(showuserID) {
      this.alterDialogVisible = true;
      axios({
        url: `http://127.0.0.1:8888/api/private/v1/users/${showuserID}`,
        method: "get",
      }).then((res) => {
        this.alterForm = res.data.data;
      });
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.alterFormRef.resetFields();
    },
    // 点击按钮  删除用户
    deleteDialog(deleteuser) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios({
            url: `http://127.0.0.1:8888/api/private/v1/users/${deleteuser}`,
            method: "delete",
          }).then((res) => {
            console.log(res);
            if (res.data.meta.status === 200) {
              this.$message.success("删除用户成功！");
              // 重新获取用户列表数据
              this.getusersData();
            } else {
              this.$message.error("删除用户失败,请联系管理员！");
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除！");
        });
    },
    // 点击按钮 弹出分配角色的对话框
    assignroles(userInfo) {
      // 每次点都初始化选中的角色为空
      this.newroles='';
      // 将当前选中行的数据赋值给 userLists 对象
      this.userLists = userInfo;
      // 查询角色
      axios({
        url: `http://127.0.0.1:8888/api/private/v1/roles`,
        method: "get",
      }).then((res) => {
        if (res.data.meta.status === 200) {
          this.rolesList = res.data.data;
        }else{
          this.$message.error("角色获取失败,请联系管理员！");
        }
      });
      this.rolesDialogVisible = true;
    },
    // 点击确定按钮, 分配角色
    saveRolesInfo() {
      if(!this.newroles) return this.$message.error("请先选择新角色！")
      // 分配用户角色
      axios({
        url: `http://127.0.0.1:8888/api/private/v1/users/${this.userLists.id}/role`,
        method:"put",
        data:{
          rid:this.newroles
        }
      }).then(res=>{
        if(res.data.meta.status===200) {
          this.$message.success("设置用户角色成功！")
          // 关闭分配角色对话框
          this.rolesDialogVisible = false;
          // 重新获取用户信息
          this.getusersData();
        }else{
          this.$message.error("设置用户角色失败,请联系管理员！")
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
</style>