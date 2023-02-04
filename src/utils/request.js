import axios from 'axios'
import { userStore } from '@/store/modules/user'

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000,
})

/**
 * 请求拦截器
 */
service.interceptors.request.use((config) => {
  config.headers.icode = '6EA07ADCCC1B4845'
  config.headers.Authorization = `Bearer ${userStore.token}`
  return config
})

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  (response) => {
    const { success, message, data } = response.data
    // 业务请求成功
    if (success) {
      return data
    }
    // 业务请求失败
    // TODO: 根据状态码 或 message 判断失败原因，给出对应提示或操作（用户信息过期，被动登出
    return Promise.reject(new Error(message))
  },
  // 响应失败的回调
  (error) => {
    // token超时处理（token 失效后，服务端会返回 401，响应失败
    if (response && response.data && response.data.code === 401) {
      userStore.logout()
      return Promise.reject(error)
    }
  }
)

export default service
