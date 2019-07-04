<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table ref="roleTable" :data="rolesList" stripe>
      <el-table-column type="expand">
        <template v-slot="{ row }">
          <el-row
            type="flex"
            v-for="level in row.children"
            :key="level.id"
            class="level1"
          >
            <el-col :span="6">
              <el-tag closable @close="deleteRoles(row, level.id)">{{
                level.authName
              }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col>
              <el-row
                type="flex"
                v-for="level2 in level.children"
                :key="level2.id"
                class="level2"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="deleteRoles(row, level2.id)"
                    >{{ level2.authName }}</el-tag
                  >
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col>
                  <el-tag
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    class="level3"
                    type="warning"
                    closable
                    @close="deleteRoles(row, level3.id)"
                    >{{ level3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            size="mini"
          ></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
          ></el-button>
          <el-button
            type="success"
            plain
            icon="el-icon-check"
            size="mini"
            @click="AssignRolesClick(row)"
            >分配角色</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配角色模态框 -->
    <el-dialog title="角色授权" :visible.sync="isAssignRolesShow">
      <div slot="footer" class="dialog-footer">
        <el-tree
          :data="assignRoles"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :props="defaultProps"
          ref="rightsTree"
        ></el-tree>
        <el-button @click="isAssignRolesShow = false">取 消</el-button>
        <el-button type="primary" @click="RolesConfirmClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      isAssignRolesShow: false,
      // 权限列表
      assignRoles: [],
      // // 默认选中的对勾
      // defaultChecked: [],
      // 用来存储要编辑的role的id
      roleId: -1,
      defaultProps: {
        children: "children",
        label: "authName"
      }
    };
  },
  methods: {
    // 请求角色列表
    async getRolesList(callback) {
      let res = await this.$http({
        url: "roles"
      });
      console.log(res);
      this.rolesList = res.data.data;
      callback && callback();
    },

    // 打开分配角色模态框
    async AssignRolesClick(row) {
      // console.log(row);
      // 把 当前正在编辑的id改成当前role的id
      this.roleId = row.id;
      console.log(this.roleId);
      this.isAssignRolesShow = true;
      let res = await this.$http({
        url: "rights/tree"
      });
      // console.log(res);
      this.assignRoles = res.data.data;
      // 遍历拿到所有的id

      let levelCheckedID = [];

      row.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            levelCheckedID.push(item3.id);
          });
        });
      });

      // // 把所有的id放到这个数组中
      let checked = [...levelCheckedID];
      // console.log(checked);
      // 2 调用 tree 中提供的 this.$refs.tree.setCheckedKeys([3]) 来选中节点
      //   参数是一个数组，数组中每一项就是 叶子节点 的key（ 也就是节点的id集合 ）
      /*
        为什么获取不到 tree 组件？
          因为 tree 是在dialog对话框中的，对话框默认是隐藏的（隐藏时通过 v-if 来实现的，也就是隐藏的时候，组件不会被渲染）。因为 对话框组件 没有渲染，所以， tree 组件也就是没有被渲染。所以， ref 就无效，因此，无法直接通过 this.$refs.tree 来获取到 tree组件

        为什么将 控制对话框展示和隐藏的数据 isShowRightsDialog 设置为true，还是拿不到 tree 组件？
          因为 Vue 中的DOM是异步更新的，也就是说：数据变化后，DOM没有立即更新，而是延迟执行了，所以，数据虽然变了，但是 DOM 还没有被立即更新，所以，无法获取到 tree 组件

        如何获取到tree组件？
          只要调用 $nextTick() 方法，在回调函数中再获取 tree 就可以获取到了
          因为 $nextTick 中的回调函数，会在DOM渲染后，立即调用，所以，当 回调函数 执行的时候，tree组件已经完成渲染，此时，就可以获取到的 tree 了
      */

      this.$nextTick(() => {
        // 设置选中
        this.$refs.rightsTree.setCheckedKeys(checked);
      });
    },

    // 分配角色确认按钮
    async RolesConfirmClick() {
      // 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
      // console.log(this.$refs.rightsTree.getCheckedKeys());
      // 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
      // console.log(this.$refs.rightsTree.getHalfCheckedKeys());
      let ridsId = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys()
      ].join(",");
      let res = await this.$http({
        url: `roles/${this.roleId}/rights`,
        method: "post",
        data: {
          rids: ridsId
        }
      });
      // console.log(res);

      // 3. 提示用户更新成功
      this.$message({
        type: "success",
        message: res.data.meta.msg,
        duration: 1000
      });
      this.isAssignRolesShow = false;
      this.getRolesList();
    },

    // 删除单个权限
    async deleteRoles(row, ridsId) {
      console.log("删除成功");
      // console.log('删除单个权限')
      // 调用接口，删除当前角色指定的权限信息
      // 接口信息
      //  roles/:id/rights/:rightID
      // method: delete
      console.log(row);
      // console.log(row.id, ridsId);
      let res = await this.$http({
        url: `roles/${row.id}/rights/${ridsId}`,
        method: "delete"
      });

      if (res.data.meta.status == 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        // console.log(res);
        this.getRolesList(() => {
          this.$nextTick(() => {
            //让表格对应的项展开即可
            // console.log();
            // toggleRowExpansion(row, expanded)用于可展开表格与树形表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）
            this.$refs.roleTable.toggleRowExpansion(
              this.rolesList.find(v => v.id === row.id),
              true
            );
          });
        });
      }
    }
  },
  created() {
    this.getRolesList();
  }
};
</script>

<style>
.level1 {
  border-bottom: 1px dashed #ccc;
  padding: 20px 0;
}
.level1:last-child {
  border-bottom: none;
}

.level2 {
  margin-bottom: 15px;
}

.level3 {
  margin-right: 10px;
}
</style>
