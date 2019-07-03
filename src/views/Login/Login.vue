<template>
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
      <el-form
        ref="form"
        :rules="formRules"
        :model="form"
        class="loginForm"
        label-position="top"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">登录</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },

      formRules: {
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
        ]
      }
    };
  },

  methods: {
    submitForm(formName) {
      // this.$refs['loginForm'] 这个就获取到了表单对象
      // 通过调用这个对象的validate方法，就可以对表单做整体校验
      // validate函数接收的参数是一个函数
      this.$refs[formName].validate(valid => {
        // valid形参，接收到的就是表单的校验结果
        // 如果表单校验成功则是 true  如果不成功则是false
        if (valid) {
          // alert("submit!");
          axios({
            url: "http://localhost:8888/api/private/v1/login",
            method: "post",
            data: this.form
          }).then(({ data: { data, meta } }) => {
            console.log(data, meta);
            if (meta.status === 200) {
              // 登录成功之后，服务器端会返回给我们一个token
              // 我们需要将这个token保存到本地
              // 保存到localstorage中就可以
              localStorage.setItem("token", data.token);
              // 登陆成功跳转页面
              this.$router.push("/home");
            } else {
              this.$message({
                message: meta.msg,
                type: "error",
                duration: 1000
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less">
.row-bg {
  height: 100%;
  background-color: #2d434c;
}
.loginForm {
  padding: 30px 20px;
  background-color: #fff;
  border-radius: 10px;
  min-width: 400px;
}
</style>

