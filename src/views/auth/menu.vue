<template>
  <div class="app-container">

    <el-card shadow="hover">
      <div class="nil-header-container">
        <div class=""><span>数据列表</span></div>
        <div class="">
          <el-button size="small" type="primary" @click="showCreatePanel">创建</el-button>
        </div>
      </div>

      <el-table :data="menus" stripe border style="width: 100%;margin-bottom: 20px;" row-key="id" default-expand-all>
        <el-table-column prop="name" label="菜单名称"/>
        <el-table-column prop="path" label="菜单路径"/>
        <el-table-column label="操作">
          <template #default="scope">

            <el-button size="mini" @click="showChangeBox(scope.row)">
              修改
            </el-button>

            <el-button
                size="mini"
                type="danger"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <el-drawer
        v-model="AddAndChangeMenusBox"
        :title="isChange? '修改菜单': '创建菜单'"
        direction="rtl"
        destroy-on-close
    >
      <div class="nil-drawer">

        <el-scrollbar class="nil-drawer-body">

          <el-form ref="form" :model="oneMenusData" label-width="120px">
            <el-form-item label="菜单名称">
              <el-input v-model="oneMenusData.name"></el-input>
            </el-form-item>

            <el-form-item label="上级菜单">
              <el-select v-model="oneMenusData.pid" placeholder="请选择菜单" style="width: 100%">
                <el-option
                    v-for="item in menuOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="菜单路径">
              <el-input v-model="oneMenusData.path"></el-input>
            </el-form-item>

            <el-form-item label="菜单图标">
              <el-input v-model="oneMenusData.icon"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="doSaveMenu">{{ isChange ? '修改' : '创建' }}</el-button>
            </el-form-item>
          </el-form>

        </el-scrollbar>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import {addMenu, authMenus, changeMenu} from "../../api/auth";
import {ElMessage} from "element-plus";

export default {
  name: "AuthMenu",
  data() {
    return {
      menus: [],
      isChange: false,
      AddAndChangeMenusBox: false, // 是否显示 menu Panel
      menuOptions: [],
      oneMenusData: {
        pid: 0,
        name: "",
        path: "",
        icon: ""
      }
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    //打开修改的面板
    showChangeBox(row) {
      this.isChange = true
      this.oneMenusData = {
        pid: row.pid,
        name: row.name,
        path: row.path,
        icon: row.icon,
        id: row.id
      }
      this.AddAndChangeMenusBox = true;
    },
    // 打开创建菜单的面板
    showCreatePanel() {
      this.isChange = false
      this.oneMenusData = {
        pid: '0',
        name: "",
        path: "",
        icon: "",
        id: ""
      }
      this.AddAndChangeMenusBox = true;
    },
    doSaveMenu() {
      //  保存数据
      if (this.isChange) {
        //  修改
        changeMenu(this.oneMenusData).then(res => {
          if (res.success) {
            ElMessage({
              message: "修改成功",
              type: "success"
            })
            this.AddAndChangeMenusBox = false
            this.getMenus()
          } else {
            ElMessage({
              message: res.message,
              type: "error"
            })
          }
        })
      } else {
        //  创建
        addMenu(this.oneMenusData).then(res => {
          if (res.success) {
            ElMessage({
              message: "创建成功",
              type: "success"
            })
            this.AddAndChangeMenusBox = false
            this.getMenus()
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
          const targetOptions = []
          targetOptions.push({id: '0', name: "无上级菜单"})
          data.forEach(item => {
            if (!target[item.pid]) {
              target[item.pid] = []
            }
            const arr = target[item.pid]
            if (item.pid === '0') targetOptions.push(item)
            arr.push(item)
          })

          const temp = target[0]
          temp.forEach((item, index) => {
            item.children = target[item.id]
          })

          this.menus = temp;
          this.menuOptions = targetOptions;
        }
      })
    },

  },
}
</script>

<style scoped>

</style>