<template>
  <div class="app-container">
    <el-card shadow="hover">
      <div class="nil-header-container">
        <div class=""><span>修改密码</span></div>
      </div>

      <div class="topTip">
        <el-alert title="修改成功后会自动退出当前登录！" type="warning" :closable="false"/>
      </div>

      <el-form
          ref="changePassForm"
          :model="oneChangePassData"
          :rules="rules"
          status-icon
          label-width="120px"
      >
        <el-form-item label="当前密码" prop="oldPass">
          <el-input
              v-model="oneChangePassData.oldPass"
              type="password"
              autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input
              v-model="oneChangePassData.newPass"
              type="password"
              autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repeatPass">
          <el-input
              v-model="oneChangePassData.repeatPass"
              type="password"
              autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doChangePass('changePassForm')">修改密码</el-button>
          <el-button type="" @click="redo('changePassForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script lang="ts">
import {changeUserPass} from "@/api/user";
import {mapActions, mapState} from "pinia";
import {useUserStore} from "@/store/user";
import {ElMessage} from "element-plus";
import {ApiReturnData} from "@/types/user";

export default {
  name: "ChangePassword",
  computed: {
    ...mapState(useUserStore, ["userinfo"]),
  },
  data() {
    const repeatPassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.oneChangePassData.newPass) {
        callback(new Error("两次密码不一致"))
      } else {
        callback()
      }
    }
    return {
      rules: {
        oldPass: [{
          required: true,
          message: '请输入当前密码',
          trigger: 'blur',
        }],
        newPass: [{
          required: true,
          message: '请输入新密码',
          trigger: 'blur',
        }],
        repeatPass: [{
          required: true,
          validator: repeatPassCheck,
          trigger: 'blur',
        }]
      },
      oneChangePassData: {
        oldPass: "",
        newPass: "",
        repeatPass: ""
      }
    }
  },
  methods: {
    ...mapActions(useUserStore,["logout"]),
    redo(v) {
      this.$refs[v].resetFields()
    },
    doChangePass(v) {
      this.$refs[v].validate((valid) => {
        if (valid) {

          console.log("changePass === > ", this.oneChangePassData)
          let upData = this.oneChangePassData;
          upData.uid = this.userinfo.uid||""
          changeUserPass(upData).then((res :ApiReturnData) => {
            if (res.success) {
              ElMessage({
                type: 'success',
                message: '修改成功',
              })
              this.logout()
              this.$nextTick(() => {
                this.$router.push("/login")
              })
            } else {
              ElMessage({
                type: 'error',
                message: res.message,
              })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.topTip {
  margin-bottom: 20px;
}
</style>