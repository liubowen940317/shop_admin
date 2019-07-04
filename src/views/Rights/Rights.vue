<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table
      :data="rightsList"
      stripe
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180"
      ></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级">
        <!-- prop="level" -->
        <template v-slot="{ row }">
          <div>{{ row.level | levelfilter }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  // 过滤器
  filters: {
    levelfilter(value) {
      // console.log(value);
      switch (value) {
        case "0":
          return "一级";
        case "1":
          return "二级";
        case "2":
          return "三级";
      }
    }
  },
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    }
  },
  async created() {
    let res = await this.$http({
      url: `rights/list`
    });
    console.log(res);
    this.rightsList = res.data.data;
  }
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
