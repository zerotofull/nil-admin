<template>
  <div class="app-container">
    <el-card shadow="hover">
      <div class="nil-header-container">
        <div class=""><span>数据列表</span></div>
        <div class="">
          <el-button size="small" type="primary" @click="showCreatePanel">创建</el-button>
        </div>
      </div>

      <el-table :data="roles" stripe border style="width: 100%;margin-bottom: 20px;">
        <el-table-column prop="roleKey" label="角色 KEY"/>
        <el-table-column prop="roleName" label="角色名称"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="handleMenus(scope.$index, scope.row)">
              修改
            </el-button>

            <el-button
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

          <el-form ref="form" :model="oneRoleData" label-width="120px">
            <el-form-item label="角色 KEY">
              <el-input v-model="oneRoleData.roleKey" v-if="isChange" readonly></el-input>
              <el-input v-model="oneRoleData.roleKey" v-else></el-input>
            </el-form-item>

            <el-form-item label="角色名称">
              <el-input v-model="oneRoleData.roleName"></el-input>
            </el-form-item>

            <el-form-item label="菜单权限">
              <el-scrollbar height="300px">
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
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="doSaveRole">{{ isChange ? '修改' : '创建' }}</el-button>
            </el-form-item>
          </el-form>

        </el-scrollbar>
      </div>
    </el-drawer>

  </div>
</template>

<script lang="ts">
import {addRoleMenu, authMenus, authRoles, changeRoleMenu, deleteMenu, deleteRole} from "@/api/auth";
import {userMenu} from "@/api/user";
import {ElMessage, ElMessageBox} from "element-plus";

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
      menus: [],

      isChange: false,
      oneRoleData: {
        roleId: "",
        roleName: "",
        roleKey: "",
      }
    }
  },
  created() {
    this.getRoles()
    this.getMenus()
  },
  methods: {
    // 打开创建菜单的面板
    showCreatePanel() {
      this.isChange = false
      this.oneRoleData = {
        roleId: "",
        roleName: "",
        roleKey: "",
      }
      this.changeRoleMenusBox = true;
    },
    doSaveRole() {
      const upData = this.oneRoleData;

      const treeChecked = this.$refs.roleMenusTree.getCheckedKeys()
      const treeChecked_half = this.$refs.roleMenusTree.getHalfCheckedKeys()
      treeChecked.push(...treeChecked_half)

      upData.menus = treeChecked

      console.log({upData})

      if (this.isChange) {
        changeRoleMenu(upData).then(res => {
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
      } else {
        addRoleMenu(upData).then(res => {
          if (res.success) {
            ElMessage({
              message: "创建成功",
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
      }

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
          if (temp) {
            temp.forEach((item, index) => {
              item.children = target[item.id]
            })
          }
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

      this.isChange = true;
      this.oneRoleData = {
        roleId: row.id,
        roleName: row.roleName,
        roleKey: row.roleKey,
      }

      this.nowSelectRole = row.id
      this.nowRoleMenuKeys = []

      userMenu(row.id).then(res => {
        if (res.success) {
          let temp = []
          const target = {}
          res.data.forEach(item => {
            if (!target[item.pid]) {
              target[item.pid] = []
            }
            target[item.pid].push(item.id)
          })

          console.log("nilbrains === >target === >", target)
          const filter = target[0]
          if (filter) {
            filter.forEach((item, index) => {
              if (target[item]) {
                temp.push(...target[item])
              } else {
                temp.push(item)
              }
            })
          }

          this.nowRoleMenuKeys = temp;
          this.$nextTick(() => {
            this.changeRoleMenusBox = true
          })
        }
      })

    },
    handleDisabled(index, row) {
      ElMessageBox.confirm(
          '是否要进行 删除 操作, 是否继续?',
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            deleteRole(row.id).then(res => {
              if (res.success) {
                ElMessage({
                  type: 'success',
                  message: '删除成功',
                })
                this.getRoles()
              } else {
                ElMessage({
                  type: 'error',
                  message: res.message,
                })
              }
            })
          })
          .catch(() => {

          })
    }

  },
}
</script>

<style scoped>

</style>