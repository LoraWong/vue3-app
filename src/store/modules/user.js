import { defineStore } from 'pinia'
import store from '@/store'
import { setItem, getItem, clear } from '@/utils/storage'
import { loginUser, getProfile, registerUser, putProfile } from '@/api/sys'
import md5 from 'md5'
import { TOKEN } from '@/constants'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: getItem(TOKEN) || '',
    userInfo: {},
  }),
  getters: {
    hasUserInfo: (state) => {
      return JSON.stringify(state.userInfo) !== '{}'
    },
  },
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
    },
    // 退出登录
    logout() {
      // 清空用户信息
      this.token = ''
      this.userInfo = {}
      clear()
      // 退出登录之后，重新刷新下页面，因为对于前台项目而言，用户是否登录（是否为 VIP）看到的数据可能不同
      // 路由守卫会做判断
      location.reload()
    },
    // 注册
    async register(payload) {
      const { password } = payload
      await registerUser({
        ...payload,
        password: password ? md5(password) : password,
      })
    },
    // 修改个人信息
    async setUserInfo(payload) {
      const data = await putProfile(payload)
      this.userInfo = data
    },
  },
})

// 在组件外使用 store
export const userStore = useUserStore(store)
