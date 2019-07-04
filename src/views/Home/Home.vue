<template>
  <el-container id="homebgc">
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="6" class="imagelogo">
          <img src="../../assets/logo.png" alt />
        </el-col>
        <el-col>
          <h1 class="header_tit">电商后台管理系统</h1>
        </el-col>
        <el-col :span="6">
          <div class="welcome">
            欢迎上海前端39期星曜会员
            <a href="#" class="tc" @click="logoutClick">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- 
          default-active="4"   设置默认高亮的菜单项  赋值的内容为菜单项的index值
          class="el-menu-vertical-demo"  可以为菜单加上自己的类名
          @open="handleOpen"    菜单的打开事件
          @close="handleClose"  菜单的折叠事件
          background-color="#545c64"  设置菜单的背景颜色
          text-color="#fff"     设置菜单的文本颜色
          active-text-color="#ffd04b"   高亮项的文本颜色
          
          :router="true"   router属性用来设置是否开启vue-router的模式，如果开启，点击菜单项的时候，会把当前菜单项的index值作为path进行路由跳转
        -->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu
            v-for="menus in menusList"
            :key="menus.id"
            :index="menus.id + ''"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ menus.authName }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="menus2 in menus.children"
                :key="menus2.id"
                :index="'/' + menus2.path"
              >
                <i class="el-icon-menu"></i>
                <span>{{ menus2.authName }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menusList: []
    };
  },
  methods: {
    // 退出功能
    logoutClick() {
      // 清除token
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  },
  async created() {
    let res = await this.$http({
      url: "menus"
    });
    // console.log(res);
    this.menusList = res.data.data;
  }
};
</script>

<style>
.el-container .el-header {
  padding: 0;
  background-color: #b3c1cd;
}
.el-col.el-col-6 img {
  width: 200px;
}
.el-header .imagelogo {
  min-width: 200px;
}
.el-header .header_tit {
  font-size: 28px;
  color: #fff;
  min-width: 235px;
  text-align: center;
}

.el-header .welcome {
  min-width: 235px;
  font-weight: bold;
  padding-right: 50px;
}
.el-header .welcome a {
  color: #daa520;
}
.el-container {
  height: 100%;
}
.el-menu-vertical-demo.el-menu {
  height: 100%;
}

#app .el-container.is-vertical {
  height: 100%;
  background-color: #eaeef1;
}
</style>
