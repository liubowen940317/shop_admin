<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table ref="singleTable" :data="goodsData" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称" width="120"></el-table-column>
      <el-table-column property="goods_price" label="商品价格" width="120"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量"></el-table-column>
      <el-table-column property="add_time" label="创建时间"></el-table-column>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsData: [],
      total: 0,
      pageSize: 5,
      currentPage: 1
    };
  },
  methods: {
    async getGoodsList() {
      let res = await this.$http({
        url: "goods",
        params: {
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      });
      console.log(res);
      this.goodsData = res.data.data.goods;
      this.total = res.data.data.total;
    },

    currentChange(page) {
      this.currentPage = page;
      this.getGoodsList();
    }
  },
  created() {
    this.getGoodsList();
  }
};
</script>

<style scoped>
.el-button.el-button--success.is-plain {
  margin-top: 20px;
}
</style>
