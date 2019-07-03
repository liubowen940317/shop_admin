<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="6" class="imagelogo">
        <el-input
          placeholder="请输入内容"
          v-model="keyword"
          @keyup.enter.native="keyWordClick"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="keyWordClick"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain @click="addUserClick">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- data  用来绑定这个表格要展示的数据对象 -->
    <!-- stripe 设置隔行变色 -->
    <el-table :data="userList" stripe style="width: 100%">
      <!-- prop 设置当前列中要展示的数据的属性名 -->
      <!-- label 当前列的表头文字 -->
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!-- 如果当前列中不会把数据直接展示出来，那么就没有必要为当前列设置prop属性 -->
      <el-table-column label="用户状态">
        <!-- 在这里，无法直接获取到每一行的数据，这个数据在el-table表格组件中 -->
        <!-- 如果要获取每一行的数据，那么我们就需要通过作用域插槽的方式，把数据接收到 -->
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#409EFF"
            inactive-color="#DCDFE6"
            @change="switchChange(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="editUser(row.id)"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="delUser(row.id)"></el-button>
          <el-button
            type="success"
            plain
            icon="el-icon-check"
            size="mini"
            @click="allocateUser(row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="currentChange"
    ></el-pagination>

    <!-- 增加的模态框 -->
    <el-dialog title="添加用户" :visible.sync="isAddUser" @close="$refs.addForm.resetFields()">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" autocomplete="off" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddUser=false">取 消</el-button>
        <el-button type="primary" @click="addClick">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改的模态框 -->
    <el-dialog title="编辑用户" :visible.sync="isEditUser">
      <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info" v-text="editForm.username"></el-tag>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditUser=false">取 消</el-button>
        <el-button type="primary" @click="editClick">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="isAllocateRoles">
      <el-form :model="allocateForm" :rules="editRules" ref="allocateForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info" v-text="allocateForm.username"></el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="allocateForm.rid" placeholder="请选择角色">
            <el-option v-for="item in roles" :key="item.id" :value="item.id" :label="item.roleName">
              <!-- <template>{{item.roleName | optionFiltes}}</template> -->
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAllocateRoles=false">取 消</el-button>
        <el-button type="primary" @click="allocateRolesClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      // 绑定输入框
      keyword: "",
      total: 6,
      // 条数
      pageSize: 3,
      // 当前页
      currentPage: 1,

      // 控制添加用户模态框的展示和隐藏的数据
      isAddUser: false,

      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 表单验证
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "用户名长度必须是5到12个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "密码长度必须是6到15个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号格式不正确",
            trigger: "change"
          }
        ]
      },

      isEditUser: false,

      // 修改用户的表单数据
      editForm: {
        id: 0,
        username: "",
        email: "",
        mobile: ""
      },
      // 修改的表单验证
      editRules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号格式不正确",
            trigger: "change"
          }
        ]
      },
      // 分配角色的模态框
      isAllocateRoles: false,
      allocateForm: {
        id: 0,
        rid: 0,
        username: ""
      },
      // 角色
      roles: []
    };
  },
  created() {
    this.getHttp();
    this.render2();
  },

  methods: {
    // 请求数据
    getHttp() {
      this.$http({
        url: "users",
        params: {
          // 根据关键字查询参数
          query: this.keyword,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      }).then(({ data: { data, meta } }) => {
        // console.log(data, meta);
        if (meta.status === 200) {
          this.userList = data.users;
          this.total = data.total;
        }
      });
    },

    // 分页触发的事件
    currentChange(page) {
      // console.log(page);
      this.currentPage = page;
      // 重新请求数据
      this.getHttp();
    },

    // switch按钮切换
    async switchChange(user) {
      // console.log(user);
      let res = await this.$http({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: "put"
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: "success",
          duration: 1000
        });
      } else {
        this.$message({
          message: res.data.meta.msg,
          type: "error",
          duration: 1000
        });
        user.mg_state = !user.mg_state;
      }
    },

    // 点击搜索关键字
    keyWordClick() {
      this.getHttp();
    },

    // 删除用户
    async delUser(id) {
      try {
        await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        // 向后台发送请求，删除当前行的用户
        let res = await this.$http({
          url: `users/${id}`,
          method: "delete"
        });
        // 重新渲染当前的列表数据
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          // 回到第一页
          this.currentPage = 1;
          this.getHttp();
        }
      } catch (err) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
    },

    // 增加用户的模态框打开
    addUserClick() {
      // console.log(111);
      this.isAddUser = true;
    },
    // 增加确认按钮
    async addClick() {
      try {
        // 1. 点击按钮时先进行表单校验
        await this.$refs.addForm.validate();
        let res = await this.$http({
          url: "users",
          method: "post",
          data: this.addForm
        });
        // console.log(res);
        if (res.data.meta.status === 201) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          // this.$refs.addForm.resetFields();
          this.getHttp();
          this.isAddUser = false;
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: "error",
            duration: 1000
          });
        }
      } catch (error) {
        // console.log(error);
      }
    },

    // 打开修改功能的模态框
    async editUser(id) {
      // 打开模态框
      this.isEditUser = true;
      // console.log(id);
      // 根据id请求数据
      let res = await this.$http({
        url: `users/${id}`
      });
      // console.log(res);

      if (res.data.meta.status === 200) {
        this.editForm = res.data.data;
      }
    },

    // 确认修改
    async editClick() {
      // console.log("修改了");
      // 先进行表单验证
      try {
        await this.$refs.editForm.validate();
        let res = await this.$http({
          url: `users/${this.editForm.id}`,
          method: "put",
          data: {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        });
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          // 重新渲染
          this.getHttp();
          // 关闭模态框
          this.isEditUser = false;
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: "error",
            duration: 1000
          });
        }
      } catch (error) {
        this.$message({
          message: "手机号输入错误",
          type: "error",
          duration: 1000
        });
      }
    },

    // 页面一件来就获取所有的角色列表数据
    async render2() {
      let res = await this.$http({
        url: "/roles"
      });

      this.roles = res.data.data;
      // console.log(this.roles);
    },

    // 打开分配角色的模态框
    async allocateUser(row) {
      // console.log(row);

      this.isAllocateRoles = true;
      const role = this.roles.find(item => item.roleName === row.role_name);
      // 注意：admin用户的角色是 超级管理员 ，这个角色不在角色列表中，所以，需要判断 role是否存在，如果存在就获取 role.id；如果不存在，就设置默认值 ''
      const rid = role ? role.id : "";
      // console.log(rid)
      console.log(rid);
      this.allocateForm.id = row.id;
      this.allocateForm.username = row.username;
      this.allocateForm.rid = rid;
    },

    // 分配角色确认按钮
    async allocateRolesClick() {
      // console.log("确认");
      let res = await this.$http({
        url: `users/${this.allocateForm.id}/role`,
        method: "put",
        data: {
          rid: this.allocateForm.rid
        }
      });
      // console.log(res);
      this.$message({
        type: "success",
        message: res.data.meta.msg,
        duration: 1000
      });
      this.isAllocateRoles = false;
    }
  }
};
</script>

<style>
.el-main .el-breadcrumb {
  font-size: 16px;
  line-height: 3;
  background-color: #d4dae0;
  padding-left: 10px;
}
</style>
