<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-steps :active="index" finish-status="success">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>
    <el-tabs tab-position="left" style="margin-top:15px" @tab-click="tabClick" v-model="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <el-form ref="form" :model="goodsAddList" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="goodsAddList.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goodsAddList.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="goodsAddList.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="goodsAddList.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="goodsAddList.catArr"
              :options="goodsoPtions"
              :props="defaultProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="goodsAddList.is_promote" label="1">是</el-radio>
            <el-radio v-model="goodsAddList.is_promote" label="0">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="nextStep(1,'pic')">下一步</el-button>
      </el-tab-pane>

      <el-tab-pane label="商品图片" name="pic">
        <!-- on-success	文件上传成功时的钩子	function(response, file, fileList) -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :headers="headers"
          :on-success="onFileUploadSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="nextStep(2,'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quill-editor v-model="goodsAddList.goods_introduce" ref="myQuillEditor"></quill-editor>
        <el-button type="primary" @click="confirmAddGoods">确认</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      index: 0,
      activeName: "basic",

      goodsAddList: {
        // 商品名称
        goods_name: "",
        // 价格
        goods_price: 0,
        // 重量
        goods_weight: 0,
        // 数量
        goods_number: 0,
        // 以为','分割的分类列表 (字符串)
        catArr: [],
        // 是否促销
        is_promote: "0",
        // 介绍
        goods_introduce: "",
        // 上传的图片临时路径
        pics: []
      },
      goodsoPtions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      }
    };
  },
  methods: {
    nextStep(value, activeName) {
      this.index = value;
      this.activeName = activeName;
    },

    tabClick(tab) {
      console.log(tab);
      this.index = +tab.index;
    },

    async getCategoriesData() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3
        }
      });
      console.log(res);
      this.goodsoPtions = res.data.data;
    },

    // 上传成功的钩子函数
    onFileUploadSuccess(res) {
      console.log(res);
      this.goodsAddList.pics.push({ pic: res.data.tmp_path });
    },
    // 确认添加商品
    async confirmAddGoods() {
      // console.log(111);
      let res = await this.$http({
        url: "goods",
        method: "post",
        data: {
          goods_name: this.goodsAddList.goods_name,
          goods_price: this.goodsAddList.goods_price,
          goods_weight: this.goodsAddList.goods_weight,
          goods_number: this.goodsAddList.goods_number,
          goods_cat: this.goodsAddList.catArr.join(),
          is_promote: this.goodsAddList.is_promote,
          goods_introduce: this.goodsAddList.goods_introduce,
          pics: this.goodsAddList.pics
        }
      });
      console.log(res);
      if (res.data.meta.status == 201) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        this.$router.push("/goods");
      }
    }
  },
  created() {
    this.getCategoriesData();
  }
};
</script>
<style>
.el-steps.el-steps--horizontal {
  margin-top: 10px;
}

.ql-editor {
  height: 400px;
}
</style>