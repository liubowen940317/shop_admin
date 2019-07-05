<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="isCategoryShow">添加商品</el-button>
    <el-table ref="singleTable" :data="categoriesData" highlight-current-row style="width: 100%">
      <!-- file-icon指的就是叶子节点的图标
            folder-icon指的就是可展开的项的图标
            prop 指的就是当前列要显示的数据的属性名称
            label 指的就是表头 
            treeKey 节点的唯一表示
            parentKey 数据的父节点id
            childKey 当前节点的所有子节点存放的属性的名字 默认是children

            indent-size是用来设置每个层级之间的缩进距离的
            设置indent-size 需要同时制定 层级属性

            level-key:    设置为数据中标识层级的属性名即可
      -->

      <el-table-tree-column
        file-icon="el-icon-notebook-2"
        folder-icon="el-icon-folder"
        prop="cat_name"
        label="分类名称"
        width="220"
        tree-key="cat_id"
        parent-key="cat_pid"
        :indent-size="50"
        level-key="cat_level"
      ></el-table-tree-column>

      <el-table-column property="cat_deleted" label="是否有效" width="120">
        <template v-slot="{row}">{{row.cat_deleted?'否':'是'}}</template>
      </el-table-column>
      <el-table-column property="cat_level" label="层级"></el-table-column>

      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="currentChange"
    ></el-pagination>

    <!-- 添加分类模态框 -->
    <el-dialog title="添加分类" :visible.sync="isAddCategoryShow">
      <el-form ref="cateForm" :model="addCategoryForm" label-width="100px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addCategoryForm.cate_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="parentArr">
          <el-cascader
            v-model="addCategoryForm.parentArr"
            :options="CateOptions"
            :props="defaultProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddCategoryShow = false">取 消</el-button>
        <el-button type="primary" @click="AddCategoryConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 当前页面中要用到 一个第三方的表格插件（ElementUI的插件）
// element-tree-grid

// 安装  npm i element-tree-grid -S

// 使用：
// 如果需要全局使用，可能很多页面里面都会用到这个组件，那么就把下面这两句代码放到main.js中
// const ElTreeGrid = require('element-tree-grid');
// Vue.component(ElTreeGrid.name, ElTreeGrid)

// 如果只是需要某个页面中使用，只需要进行局部注册组件即可
// 在使用到这个组件的页面中，引入该组件，然后进行 components 局部注册即可
const ElTreeGrid = require("element-tree-grid");

// console.log(ElTreeGrid.name);
// el-table-tree-column
// 页面中使用该组件，只需要用  el-table-tree-column 标签即可
export default {
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      categoriesData: [],
      total: 0,
      pageSize: 5,
      currentPage: 1,
      isAddCategoryShow: false,
      addCategoryForm: {
        cate_name: "",
        parentArr: []
      },
      CateOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        checkStrictly: true
      }
    };
  },
  methods: {
    // 商品数据列表
    async getCategoriesList() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      });
      // console.log(res);
      this.categoriesData = res.data.data.result;
      this.total = res.data.data.total;
    },

    // 分页事件
    currentChange(page) {
      this.currentPage = page;
      this.getCategoriesList();
    },

    // 打开模态框
    async isCategoryShow() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 2
        }
      });
      console.log(res);
      this.CateOptions = res.data.data;
      this.isAddCategoryShow = true;
    },
    // 提交确认的商品
    async AddCategoryConfirm() {
      // 1. 获取表单数据
      // cat_pid分类父 ID不能为空
      // cat_name分类名称不能为空
      // cat_level
      let cat_name = this.addCategoryForm.cate_name;
      // cat_level其实可以直接用 parentArr.length
      let cat_level = this.addCategoryForm.parentArr.length;
      // this.addCateFormData.parentArr  这个里面放的是所有的父分类的id
      // 我们只需要最后一个就可以
      let cat_pid = this.addCategoryForm.parentArr.pop() || 0;
      let res = await this.$http({
        url: "categories",
        method: "post",
        data: {
          cat_name,
          cat_level,
          cat_pid
        }
      });
      console.log(res);
      if (res.data.meta.status == 201) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });

        // 模态框关闭
        this.isAddCategoryShow = false;

        //   // 重置表单
        // 要重置表单必须 在el-form-item标签中添加prop属性
        this.$refs.cateForm.resetFields();

        // 重新获取数据
        this.getCategoriesList();
      }
    }
  },
  created() {
    this.getCategoriesList();
  }
};
</script>

<style scoped>
.el-button.el-button--success.is-plain {
  margin-top: 20px;
}
</style>
