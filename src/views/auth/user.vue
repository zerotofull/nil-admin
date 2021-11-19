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
          <el-input v-model="searchData.username"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover">
      <div class="nil-header-container">
        <div class=""><span>数据列表</span></div>
      </div>

      <el-table :data="tableData" stripe border style="width: 100%;margin-bottom: 20px;">
        <el-table-column prop="username" label="账号"/>
        <el-table-column prop="roleId" label="角色">
          <template #default="scope">
            <el-tag type="success">{{ roleFormat[scope.row.roleId]||'极为普通' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="是否启用">
           <template #default="scope">
            <el-tag :type="scope.row.roleId =='1'?'success':'info'">
              {{scope.row.roleId =='1'?'启用':'禁用'}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              分配角色
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDisabled(scope.$index, scope.row)"
            >
              禁用
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div>
        <el-pagination layout="total, prev, pager, next" :page-size="page.size" :total="page.total"></el-pagination>
      </div>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="权限选择">
      <el-form style="width: 100%">
        <el-form-item label-width="0">
          <el-select v-model="nowSelectRole" placeholder="Select">
            <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateUserRole"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {authRoles, authUsers, authUsersStatus, authUsersUpdateRole} from "@/api/auth";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "AuthMenu",
  data() {
    return {
      nowSelectRole: "",
      nowSelectUser: {},
      dialogFormVisible: false,
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
      roleFormat:{}
    }
  },
  created() {
    this.initData()
    this.getRoles()
  },
  methods: {
    updateUserRole() {
      authUsersUpdateRole({
        uid: this.nowSelectUser.id,
        role: this.nowSelectRole
      }).then(res => {
        if (res.success) {
          ElMessage({
            type: 'success',
            message: '修改成功',
          })
          this.dialogFormVisible = false
          this.$nextTick(() => {
            this.nowSelectRole = ""
            this.nowSelectUser = {}
            this.initData()
          })
        }
      })
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
      this.nowSelectRole = row.roleId || ""
      this.nowSelectUser = row
      this.dialogFormVisible = true
    },
    handleDisabled: function (index, row) {
      ElMessageBox.confirm(
          '是否要进行 禁用 操作, 是否继续?',
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            authUsersStatus({
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