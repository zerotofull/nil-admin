<template>
  <div class="app-container">
    <el-card shadow="hover">
      <div class="nil-header-container">
        <div class=""><span>数据列表</span></div>
      </div>

      <el-table :data="roles" stripe border style="width: 100%;margin-bottom: 20px;">
        <el-table-column prop="roleKey" label="角色 KEY"/>
        <el-table-column prop="roleName" label="角色名称"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleMenus(scope.$index, scope.row)">
              分配菜单
            </el-button>

            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              修改
            </el-button>

            <el-button
                size="mini"
                type="danger"
                @click="handleDisabled(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer
        v-model="changeRoleMenusBox"
        title="菜单选择"
        direction="rtl"
        destroy-on-close
    >
      <div class="nil-drawer">

        <el-scrollbar class="nil-drawer-body">
          <el-tree
              :data="menus"
              ref="roleMenusTree"
              show-checkbox
              node-key="id"
              :default-checked-keys="nowRoleMenuKeys"
              :props="defaultProps"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :check-on-click-node="true"
          />
        </el-scrollbar>
        <div class="nil-drawer-options">
          <el-button type="primary" @click="doChangeRoleMenus">确定</el-button>
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<script lang="ts">
import {authMenus, authRoles, changeRoleMenu} from "@/api/auth";
import {userMenu} from "@/api/user";
import {ElMessage} from "element-plus";

export default {
  name: "AuthRole",
  data() {
    return {
      menuDataTreeLoading: false,
      changeRoleMenusBox: false,
      roles: [],

      defaultProps: {
        children: 'children',
        label: 'name',
      },
      nowSelectRole: "",
      nowRoleMenuKeys: [],
      menus: []


    }
  },
  created() {
    this.getRoles()
    this.getMenus()
  },
  methods: {
    doChangeRoleMenus() {
      const treeChecked =  this.$refs.roleMenusTree.getCheckedKeys()
      const treeChecked_half = this.$refs.roleMenusTree.getHalfCheckedKeys()
      treeChecked.push(...treeChecked_half)
      console.log({treeChecked,role :this.nowSelectRole})

      changeRoleMenu({
        role :this.nowSelectRole,
        menus: treeChecked
      }).then(res => {
        if (res.success) {
          ElMessage({
            message: "修改成功",
            type: "success"
          })
          this.changeRoleMenusBox = false
          this.getRoles()
        } else {
          ElMessage({
            message: res.message,
            type: "error"
          })
        }
      })

    },
    getMenus() {
      authMenus().then(res => {
        if (res.success) {
          const data = res.data
          const target = {}
          data.forEach(item => {
            if (!target[item.pid]) {
              target[item.pid] = []
            }
            const arr = target[item.pid]
            arr.push(item)
          })
          const temp = target[0]
          temp.forEach((item, index) => {
            item.children = target[item.id]
          })
          this.menus = temp;
        }
      })
    },
    getRoles() {
      authRoles().then(res => {
        if (res.success) {
          this.roles = res.data
        }
      })
    },
    handleMenus(index, row) {
      console.log(row);
      
      this.nowSelectRole = row.id
      this.nowRoleMenuKeys = []


      userMenu(row.id).then(res => {
        if (res.success) {
          let temp = []
          res.data.forEach(item => {
            temp.push(item.id)
          })
          this.nowRoleMenuKeys = temp;
          this.$nextTick(() => {
            this.changeRoleMenusBox = true
          })
        }
      })
      
    },
    handleEdit(index, row) {

    },
    handleDisabled(index, row) {

    }

  },
}
</script>

<style scoped>

</style>