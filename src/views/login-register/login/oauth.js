import { userStore } from '@/store/modules/user'
import { LOGIN_TYPE_NO_REGISTRATION_CODE } from '@/constants'
import { useRouter } from 'vue-router'
import { message } from '@/libs'

const router = useRouter()

/**
 * @description: 第三方登录验证（验证是否已注册
 * @param {*} oauthType 登录方式
 * @param {*} oauthData 第三方用户数据
 */
export const oauthLogin = async (oauthType, oauthData) => {
  // 发送登录请求
  const code = await userStore.login({
    loginType: oauthType,
    ...oauthData,
  })
  // 根据返回的数据data中的code判断用户是否已注册（服务端返回数据中 code为204，则表示当前用户未注册
  if (code === LOGIN_TYPE_NO_REGISTRATION_CODE) {
    // 未注册，携带用户数据跳转到注册页面，执行注册
    message('success', `欢迎您！${oauthData.nickname}, 请创建您的账号`, 6000)
    router.push({
      path: '/register',
      query: {
        reqType: oauthType,
        ...oauthData,
      },
    })
    return
  }
  // 已注册, 登录后跳转到首页
  router.push('/')
}
