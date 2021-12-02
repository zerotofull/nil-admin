import axios from 'axios'
import { useUserStore } from '@/store/user'
import { ElNotification } from 'element-plus'
import { BASE_API, BASE_API_TIMEOUT } from '@/setting'
import {ApiReturn} from '@/types/user'

// 创建axios实例
const service = axios.create({
  baseURL: BASE_API, // api 的 base_url
  timeout: BASE_API_TIMEOUT, // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['auth'] = userStore.token // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response: ApiReturn)  => {
    return response.data
  },
  (error) => {
    let code = 0
    try {
      code = error.response.data.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        ElNotification({
          title: 'Error',
          message: '网络请求超时',
          type: 'error',
        })
        return Promise.reject(error)
      }
    }
    console.log(code)
    if (code) {
      // TODO
    } else {
      ElNotification({
        title: 'Error',
        message: '接口请求失败',
        type: 'error',
      })
    }
    return Promise.reject(error)
  }
)
export default service
