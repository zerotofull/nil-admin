<template>
  <div class="login" :style="'background-image:url(' + Background + ');'">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      label-position="left"
      label-width="0px"
      class="login-form"
    >
      <h3 class="title">{{ APP_TITLE }}</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <Lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin: 0 0 25px 0"
        >记住我</el-checkbox
      >
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { userLogin } from '@/api/user'
import { Lock, User } from '@element-plus/icons'
import Background from '@/assets/images/background.jpg'
import { APP_TITLE } from '@/setting'
import { page } from '@/utils/constant'
import { ElMessage } from 'element-plus'
import { mapActions, mapStores } from 'pinia'
import { useUserStore } from '@/store/user'
import {ApiReturnData} from "@/types/user";

export default {
  name: 'Login',
  components: {
    Lock,
    User,
  },
  computed: {
    ...mapStores(useUserStore),
  },
  data() {
    return {
      APP_TITLE,
      Background: Background,
      loginForm: {
        username: 'whh',
        password: '123456',
        rememberMe: false,
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' },
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
        ],
      },
      loading: false,
      redirect: undefined,
    }
  },
  created() {},
  methods: {
    ...mapActions(useUserStore, ['setToken']),
    handleLogin() {
      this.$refs.loginForm.validate((valid: any) => {
        if (valid) {
          this.loading = true
          userLogin(this.loginForm).then((res :ApiReturnData) => {
            if (res.success) {
              this.loading = false
              ElMessage({
                message: page.userLoginSuccess,
                type: 'success',
              })
              console.log(res.data)
              this.setToken(res.data)
              this.$nextTick(() => {
                this.$router.push('/')
              })
            } else {
              this.loading = false
              ElMessage({
                message: res.message,
                type: 'error',
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
}

.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 385px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
</style>
