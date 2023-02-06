import router from '@/router'
import { userStore } from '@/store/modules/user'
import { message } from '@/libs'

router.beforeEach(async (to, from) => {

  // 已登录
  if (userStore.token) {
    // 是否存在 userInfo
    if (userStore.hasUserInfo) {
      // 放行
      return true
    } else {
      try {
        // 获取 userInfo
        await userStore.getUserInfo()
        // 放行
        return true
      } catch (error) {
        // 跳转到首页
        return '/'
      }
    }
  } else {
    // 未登录
    // 无需登录访问的页面
    if (!to.meta.user) {
      return true
    } else {
      // 需要登录访问的页面，提示后返回首页
      message('warn', '请重新登录！')
      // 跳转到首页
      return '/'
    }
  }
})
