<template>
  <div class="app-container">
    <el-card shadow="hover" style="margin-bottom: 20px;">
      <div class="nil-header-container">
        <div class=""><span>筛选搜索</span></div>
        <div class="">
          <el-button size="small" type="default" @click="reStore">重置</el-button>
          <el-button size="small" type="primary" @click="doSearch">搜索</el-button>
        </div>
      </div>
      <el-form size="small" :inline="true">
        <el-form-item label="用户名">
          <el-input v-model="searchData.username" @keydown.enter.prevent="()=>{}"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover">
      <div class="nil-header-container">
        <div class=""><span>数据列表</span></div>
        <div class="">
          <el-button size="small" type="primary" @click="showCreatePanel">创建</el-button>
        </div>
      </div>

      <el-table :data="tableData" stripe border style="width: 100%;margin-bottom: 20px;">
        <el-table-column prop="username" label="账号"/>
        <el-table-column prop="name" label="昵称"/>
        <el-table-column prop="roleId" label="角色">
          <template #default="scope">
            <el-tag type="success">{{ roleFormat[scope.row.roleId] || '极为普通' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="是否启用">
          <template #default="scope">
            <el-tag :type="scope.row.status ==='1'?'success':'info'">
              {{ scope.row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">
              修改
            </el-button>
            <el-button type="primary" @click="handleRePass(scope.$index, scope.row)">
              重置密碼
            </el-button>
            <el-button
                type="danger"
                @click="handleDisabled(scope.$index, scope.row)"
            >
              {{ scope.row.status === '1' ? '禁用' : '启用'  }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div>
        <el-pagination layout="total, prev, pager, next" :page-size="page.size" :total="page.total"></el-pagination>
      </div>
    </el-card>

    <el-drawer
        v-model="addAndChangeBox"
        :title="isChange? '修改菜单': '创建菜单'"
        direction="rtl"
        destroy-on-close
    >
      <div class="nil-drawer">

        <el-scrollbar class="nil-drawer-body">

          <el-form ref="form" :model="oneUserData" label-width="120px">
            <el-form-item label="昵称">
              <el-input v-model="oneUserData.name"></el-input>
            </el-form-item>

            <el-form-item label="账号">
              <el-input v-model="oneUserData.username"></el-input>
            </el-form-item>

            <el-form-item label="密码" v-if="!isChange">
              <el-input v-model="oneUserData.password" type="password"></el-input>
            </el-form-item>

            <el-form-item label="角色">
              <el-select v-model="oneUserData.roleId" placeholder="Select" style="width: 100%">
                <el-option
                    v-for="item in roles"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="doSaveUser">{{ isChange ? '修改' : '创建' }}</el-button>
            </el-form-item>
          </el-form>

        </el-scrollbar>
      </div>
    </el-drawer>

  </div>
</template>

<script lang="ts">
import {authRoles, authUsers, authUsersStatus, changeUser, createUser} from "@/api/auth";
import {ElMessage, ElMessageBox} from "element-plus";
import {reUserpass} from "@/api/user";

export default {
  name: "AuthMenu",
  data() {
    return {
      page: {
        cur: 1,
        size: 10,
        total: 0,
        key: ""
      },
      searchData: {
        username: ""
      },

      tableData: [],
      roles: [],
      roleFormat: {},

      oneUserData: {
        id: "",
        name: "",
        username: "",
        password: "",
        roleId: "",
      },
      addAndChangeBox: false,
      isChange: false
    }
  },
  created() {
    this.initData()
    this.getRoles()
  },
  methods: {
    showCreatePanel() {

      this.oneUserData = {
        id: "",
        name: "",
        username: "",
        password: "",
        roleId: "10096",
      }

      this.addAndChangeBox = true
      this.isChange = false

    },

    handleRePass(index, row) {
      ElMessageBox.confirm(
          `是否要进行 重置 操作, 是否继续?`,
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {

            reUserpass(row.id).then(res => {
              if (res.success) {
                ElMessage({
                  type: 'success',
                  message: res.message,
                })
                this.initData()
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
    },

    doSaveUser() {

      console.log(this.oneUserData)

      if (this.isChange) {
        changeUser(this.oneUserData).then(res => {
          if (res.success) {
            ElMessage({
              message: "修改成功",
              type: "success"
            })
            this.addAndChangeBox = false
            this.initData()
          } else {
            ElMessage({
              message: res.message,
              type: "error"
            })
          }
        })
      }else{
        createUser(this.oneUserData).then(res => {
          if (res.success) {
            ElMessage({
              message: "创建成功",
              type: "success"
            })
            this.addAndChangeBox = false
            this.initData()
          } else {
            ElMessage({
              message: res.message,
              type: "error"
            })
          }
        })
      }


    },
    getRoles() {
      authRoles().then(res => {
        if (res.success) {
          this.roles = res.data
          res.data.forEach(item => {
            this.roleFormat[item.id] = item.roleName
          });
        }
      })
    },
    reStore() {
      this.page.key = ""
      this.searchData.username = ""
      this.page.cur = 1
      this.initData()
    },
    doSearch() {
      this.page.key = this.searchData.username
      this.page.cur = 1
      this.initData()
    },
    initData() {
      const data = {
        current: this.page.cur || 1,
        size: this.page.size || 10,
        key: this.page.key || ""
      };
      authUsers(data).then(res => {
        console.log(res)
        if (res.success) {
          this.tableData = res.data.records;
          this.page.cur = res.data.current
          this.page.size = res.data.size
          this.page.total = res.data.total
        }
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
      this.oneUserData = {
        id: row.id,
        name: row.name,
        username: row.username,
        password: "",
        roleId: row.roleId,
      }

      this.addAndChangeBox = true
      this.isChange = true

    },
    handleDisabled: function (index, row) {
      ElMessageBox.confirm(
          `是否要进行 ${row.status === '1' ? '禁用' : '启用'} 操作, 是否继续?`,
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            authUsersStatus({
              id: row.id,
              status: row.status
            }).then(res => {
              if (res.success) {
                ElMessage({
                  type: 'success',
                  message: '修改成功',
                })
                this.initData()
              } else {
                ElMessage({
                  type: 'error',
                  message: '修改失败',
                })
              }
            })
          })
          .catch(() => {

          })
    },

  },
}
</script>

<style scoped>

</style>