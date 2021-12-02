<template>
  <div class="app-container">

    <el-card shadow="hover">

      <div class="nil-header-container">
        <div class=""><span>数据列表</span></div>
        <div class="">
          <el-button size="small" type="primary" @click="showCreatePanel">创建</el-button>
        </div>
      </div>

      <div class="topTip">
        <el-alert title="修改、删除 菜单并不会直接改变侧边栏。需要重新加载页面。" type="warning" :closable="false"/>
      </div>

      <el-table :data="menus" stripe border style="width: 100%;margin-bottom: 20px;" row-key="id" default-expand-all>

        <el-table-column prop="name" label="菜单名称"/>
        <el-table-column prop="icon" label="图标" width="40px">
          <template #default="scope">
            <i :class="[nilIcons.font_family,scope.row.icon]"></i>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="菜单路径"/>
        <el-table-column prop="sort" label="排序"/>
        <el-table-column label="操作">
          <template #default="scope">

            <el-button @click="showChangeBox(scope.row)">
              修改
            </el-button>

            <el-button
                type="danger"
                @click="deleteIt(scope.row)"
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

            <el-form-item label="快速填写" v-if="!isChange">
              <el-select v-model="menusHintValSelect" placeholder="请选择菜单" style="width: 100%" @change="menuHintSelect">
                <el-option
                    v-for="(item,index) in menusHint"
                    :key="index"
                    :label="item.name"
                    :value="index"
                >
                </el-option>
              </el-select>
            </el-form-item>

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
              <el-select v-model="oneMenusData.icon" placeholder="Select"  style="width: 100%"  filterable>
                <template #prefix>
                  <div style="color: #409EFF">
                    <i :class="[nilIcons.font_family, oneMenusData.icon]"></i>
                  </div>
                </template>
                <div class="icons">
                  <el-option
                      v-for="item in nilIcons.glyphs"
                      :key="item.icon_id"
                      :label="item.name"
                      :value="`${nilIcons.css_prefix_text}${item.font_class}`"
                  >
                    <div class="item">
                      <i :class="`${nilIcons.font_family} ${nilIcons.css_prefix_text}${item.font_class}`"></i>
                      <div class="iconName">{{ item.name }}</div>
                    </div>
                  </el-option>
                </div>
              </el-select>

            </el-form-item>

            <el-form-item label="排序">
              <el-input v-model="oneMenusData.sort" type="number"></el-input>
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

<script lang="ts">
import {addMenu, authMenus, changeMenu, deleteMenu} from "@/api/auth";
import {ElMessage, ElMessageBox} from "element-plus";
import {mapActions} from "pinia";
import {useUserStore} from "@/store/user";
import {nilIcons} from "@/plugins/nil.icons";
import {ApiReturnData} from "@/types/user";

export default {
  name: "AuthMenu",
  data() {
    return {
      nilIcons: nilIcons,
      menus: [],
      isChange: false,
      AddAndChangeMenusBox: false, // 是否显示 menu Panel
      menuOptions: [],
      oneMenusData: {
        pid: 0,
        name: "",
        path: "",
        icon: "",
        sort: 0
      },
      menusHint: [],
      menusHintValSelect: ""
    }
  },
  created() {
    this.getMenus()
    this.getMenuHints()
  },
  methods: {
    ...mapActions(useUserStore, ["ganHintMenus"]),
    async getMenuHints() {
      this.menusHint = await this.ganHintMenus()
    },
    menuHintSelect(val) {
      const temp = this.menusHint[val]
      this.oneMenusData.name = temp.name || ""
      this.oneMenusData.path = temp.path || ""
    },
    //删除 他
    deleteIt(row) {
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
            deleteMenu(row.id).then(res => {
              if (res.success) {
                ElMessage({
                  type: 'success',
                  message: '删除成功',
                })
                this.getMenus()
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
    //打开修改的面板
    showChangeBox(row) {
      this.isChange = true
      this.oneMenusData = {
        pid: row.pid,
        name: row.name,
        path: row.path,
        icon: row.icon,
        id: row.id,
        sort: row.sort
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
        id: "",
        sort: 0
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
      authMenus().then((res :ApiReturnData) => {
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
          if (temp) {
            temp.forEach((item, index) => {
              item.children = target[item.id]
            })
          }

          this.menus = temp;
          this.menuOptions = targetOptions;
        }
      })
    },

  },
}
</script>

<style lang="scss" scoped>
.topTip {
  margin-bottom: 20px;
}

.icons {
  grid-template-columns: repeat(6, 1fr);
  padding: 5px 5px;
  display: grid;
  grid-row-gap: 5px;
  grid-column-gap: 5px;
  .el-select-dropdown__item {
    height: auto;
    padding: 0;
  }
  .item {
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0);
    color: #999;
    border-radius: 5px;
    height: 60px;
    transition: all .4s;
    padding: 5px 5px;

    i {
      font-size: 18px;
    }

    .iconName {
      font-size: 12px;
    }
  }
}
</style>