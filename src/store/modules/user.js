import { defineStore } from 'pinia'
import store from '@/store'
import { setItem, getItem, clear } from '@/utils/storage'
import { loginUser, getProfile, registerUser } from '@/api/sys'
import md5 from 'md5'
import { USER_INFO, TOKEN } from '@/constants'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: getItem(TOKEN) || '',
    userInfo: getItem(USER_INFO) || '',
  }),
  actions: {
    // 登录
    async login(payload) {
      // 密码加密
      const { password } = payload
      // 发请求, 获取token
      const data = await loginUser({
        ...payload,
        password: password ? md5(password) : '',
      })
      // 保存 token
      this.token = data.token
      setItem(TOKEN, data.token)
      // 获取用户信息
      await this.getUserInfo()
    },
    // 获取用户信息
    async getUserInfo() {
      const data = await getProfile()
      this.userInfo = data
      setItem(USER_INFO, data)
    },
    // 退出登录
    logout() {
      // 清空用户信息
      this.token = ''
      this.userInfo = ''
      clear()
    },
    // 注册
    async register(payload) {
      const { password } = payload
      await registerUser({
        ...payload,
        password: password ? md5(password) : password,
      })
    },
  },
})


export const userStore = useUserStore()

