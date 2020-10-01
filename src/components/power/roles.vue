<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="rolesDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 主体内容区域 -->
      <el-table :data="rolesList">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['vcenter', 'roles_bottem', i1 === 0 ? 'roles_top' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="i1"
            >
              <!-- 第一列 一级权限 -->
              <el-col :span="6">
                <el-tag closable @close="closeTagById(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 第二列和第三列 二级和三级权限 -->
              <el-col :span="18">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'roles_top', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="i2"
                >
                  <!-- 二级权限 -->
                  <el-col :span="8">
                    <el-tag
                      closable
                      @close="closeTagById(scope.row, item2.id)"
                      type="warning"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="closeTagById(scope.row, item3.id)"
                      type="success"
                      v-for="(item3, i3) in item2.children"
                      :key="i3"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽 可以获取当行的所有数据 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="alterRoles(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-bangzhu"
              @click="permissions(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色表单对话框 -->
    <el-dialog title="添加角色" :visible.sync="rolesDialogVisible" width="50%">
      <el-form
        ref="rolesFormRef"
        :rules="rolesFormRules"
        :model="rolesForm"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 根据角色id 弹出该角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="alterDialogVisible" width="50%">
      <el-form
        ref="rolesFormRef"
        :rules="alterFormRules"
        :model="alterForm"
        label-width="80px"
      >
        <el-form-item label="角色ID" prop="roleId">
          <el-input v-model="alterForm.roleId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="alterForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="alterForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alterRolesData(alterForm.roleId)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRolesDialogVisible"
      width="30%"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rolesLists"
        :props="rolesProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入axios
import axios from "axios";
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 添加角色对话框的显示与隐藏
      rolesDialogVisible: false,
      // 添加角色
      rolesForm: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色校验规则
      rolesFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 修改角色对话框的显示与隐藏
      alterDialogVisible: false,
      // 修改角色
      alterForm: {},
      // 修改角色的校验规则
      alterFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 分配权限对话框的显示与隐藏
      setRolesDialogVisible: false,
      // 所有权限的数据
      rolesLists: [],
      // 树形控件的属性绑定对象
      rolesProps: {
        // 根据哪个来进行层级结构
        children: "children",
        // 要在树形控件上显示哪个
        label: "authName",
      },
      // 默认选中的节点ID值数组
      defKeys: [],
      // 即将分配权限的角色id
      rolesId: "",
    };
  },
  created() {
    this.getrolesData();
  },
  methods: {
    // 获取角色列表
    getrolesData() {
      axios({
        url: "http://127.0.0.1:8888/api/private/v1/roles",
        method: "get",
      }).then((res) => {
        this.rolesList = res.data.data;
      });
    },
    // 点击确认按钮  添加角色并关闭对话框
    addRolesData() {
      this.$refs.rolesFormRef.validate((valid) => {
        if (valid === true) {
          axios({
            url: "http://127.0.0.1:8888/api/private/v1/roles",
            method: "post",
            data: this.rolesForm,
          }).then((res) => {
            if (res.data.meta.status === 201) {
              // 弹出添加成功提示
              this.$message.success("添加角色成功！");
              // 关闭添加角色对话框
              this.rolesDialogVisible = false;
              // 重新获取角色列表
              this.getrolesData();
            } else {
              this.$message.error("添加角色失败,请联系管理员！");
            }
          });
        }
      });
    },
    // 点击编辑按钮 弹出修改角色对话框
    alterRoles(alterId) {
      this.alterDialogVisible = true;
      axios({
        url: `http://127.0.0.1:8888/api/private/v1/roles/${alterId}`,
        method: "get",
      }).then((res) => {
        this.alterForm = res.data.data;
      });
    },
    // 点击确定按钮,修改角色并关闭对话框
    alterRolesData(alterId) {
      this.$refs.rolesFormRef.validate((valids) => {
        if (valids === true) {
          axios({
            url: `http://127.0.0.1:8888/api/private/v1/roles/${alterId}`,
            method: "put",
            data: this.alterForm,
          }).then((res) => {
            if (res.data.meta.status === 200) {
              this.$message.success("修改角色成功！");
              // 关闭修改角色对话框
              this.alterDialogVisible = false;
              // 重新获取角色列表
              this.getrolesData();
            } else {
              this.$message.error("修改角色失败,请联系管理员！");
            }
          });
        }
      });
    },
    // 点击按钮  删除角色
    deleteRoles(deleteId) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除角色接口
          axios({
            url: `http://127.0.0.1:8888/api/private/v1/roles/${deleteId}`,
            method: "delete",
          }).then((res) => {
            if (res.data.meta.status === 200) {
              this.$message.success("删除角色成功！");
              // 重新获取角色列表
              this.getrolesData();
            } else {
              this.$message.error("删除角色失败,请联系管理员！");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击删除权限
    closeTagById(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios({
            url: `http://127.0.0.1:8888/api/private/v1/roles/${role.id}/rights/${rightId}`,
            method: "delete",
          }).then((res) => {
            console.log(res);
            if (res.data.meta.status === 200) {
              this.$message.success("删除权限成功！");
              // 将获取到的最新权限赋值给当前角色的权限列表
              role.children = res.data.data;
            } else {
              this.$message.error("删除权限失败,请联系管理员！");
            }
          });
        })
        .catch(() => {
          this.$message.info("取消了删除");
        });
    },
    // 点击弹出分配权限的对话框
    permissions(roles) {
      // 把当前角色的id赋值给rolesId
      this.rolesId = roles.id;
      // 打开分配权限对话框时先初始化里面的数组
      this.defKeys = [];
      axios({
        url: "http://127.0.0.1:8888/api/private/v1/rights/tree",
        method: "get",
      }).then((res) => {
        this.rolesLists = res.data.data;

        // 递归获取三级节点的ID
        this.getLeafKeys(roles, this.defKeys);
      });
      this.setRolesDialogVisible = true;
    },
    // 通过递归的形式,获取角色下所有的三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children属性,则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      // 使用递归函数
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    // 点击为角色分配权限
    allotRoles() {
      // 把目前选中的节点放到一个数组中
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      // 数据之间用 , 隔开
      const idStr = keys.join(",");

      axios({
        url: `http://127.0.0.1:8888/api/private/v1/roles/${this.rolesId}/rights`,
        method: "post",
        data: {
          rids: idStr,
        },
      }).then((res) => {
        if (res.data.meta.status === 200) {
          this.$message.success("分配权限成功！");
          // 关闭分配权限的对话框
          this.setRolesDialogVisible = false;
          // 重新获取角色列表数据
          this.getrolesData();
        } else {
          this.$message.error("分配权限失败,请联系管理员！");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}
.roles_top {
  border-top: 1px solid #cfcfcf;
}
.roles_bottem {
  border-bottom: 1px solid #cfcfcf;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>