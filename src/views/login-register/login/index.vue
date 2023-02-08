<template>
  <div class="flex justify-center items-center bg-slate-200 h-full">
    <div
      class="bg-gradient xl:bg-white dark:bg-zinc-800 w-full h-full xl:w-[768px] xl:h-[600px] overflow-hidden xl:rounded-lg xl:shadow-lg relative"
    >
      <m-navbar class="bg-inherit xl:hidden" :clickLeft="onBackClick">
        <m-svg-icon name="logo" class="w-13 h-2"></m-svg-icon>
      </m-navbar>

      <div class="absolute left-0 bottom-0 w-full xl:w-[50%] h-[80%] xl:h-full z-20">
        <img
          src="@/assets/avatar.png"
          class="absolute left-[50%] translate-x-[-50%] translate-y-[-50%] w-6 h-6 rounded-full xl:hidden"
        />
        <vee-form
          action="#"
          class="bg-white flex items-center justify-center flex-col px-5 py-8 text-center rounded-t-3xl xl:rounded-none"
          @submit="onLoginHandler"
        >
          <h3 class="mb-2 font-semibold text-base text-zinc-800 dark:text-zinc-300">账号登录</h3>
          <!-- 用户名 -->
          <vee-field
            type="text"
            placeholder="用户名"
            name="username"
            autocomplete="on"
            class="login-input"
            :rules="validateUsername"
            v-model="loginForm.username"
          />
          <!-- 错误提示 -->
          <vee-error-message
            class="text-sm text-red-600 block mt-0.5 text-left self-end"
            name="username"
          ></vee-error-message>
          <!-- 密码 -->
          <vee-field
            type="password"
            placeholder="密码"
            name="password"
            autocomplete="on"
            class="login-input"
            :rules="validatePassword"
            v-model="loginForm.password"
          />
          <!-- 错误提示 -->
          <vee-error-message
            class="text-sm text-red-600 block mt-0.5 text-left self-end"
            name="password"
          ></vee-error-message>
          <div class="pb-3 leading-[0px] text-right">
            <a
              class="inline-block p-1 text-main text-right dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 text-sm duration-400 cursor-pointer"
              @click="onToRegister"
            >
              没有账号？去注册
            </a>
          </div>
          <m-button
            class="w-[50%] dark:bg-zinc-900 xl:dark:bg-zinc-800 rounded-lg bg-gradient-to-l from-[#FF4B2B] to-[#FF416C]"
            :loading="loading"
            >登录
          </m-button>
          <div class="w-full flex justify-around">
            <!-- QQ -->
            <qq-login-vue></qq-login-vue>
            <!-- 微信 -->
            <weixin-login-vue></weixin-login-vue>
          </div>
        </vee-form>
      </div>
      <div class="absolute right-0 w-[50%] h-[100%] overflow-hidden z-30 hidden xl:block">
        <div class="h-[100%] bg-gradient text-white flex justify-center items-center">
          <div class="flex justify-center items-center flex-col text-center">
            <router-link to="/">
              <m-svg-icon name="logo" class="absolute left-2 top-2 cursor-pointer"></m-svg-icon>
            </router-link>
            <h1>Welcome Back!</h1>
            <p class="text-base">To keep connected with us please login with your personal info</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
}
</script>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Form as VeeForm, Field as VeeField, ErrorMessage as VeeErrorMessage } from 'vee-validate'
import { validateUsername, validatePassword } from '../validator.js'
import { useUserStore } from '@/store/modules/user.js'
import { LOGIN_TYPE_USERNAME } from '@/constants'
import { message } from '@/libs'
import { useAppStore } from '@/store/modules/app.js'
import qqLoginVue from './qq-login.vue'
import weixinLoginVue from './weixin-login.vue'

const appStore = useAppStore()

const userStore = useUserStore()
const router = useRouter()

console.log('login')

// 用户名和密码
const loginForm = ref({
  username: 'LGD_Sunday',
  password: '123123',
})

/**
 * @description: 登录触发
 * 为 vee-form 添加 submit 事件，可以发现，当表单校验不通过时，不会触发该事件
 */
const loading = ref(false)
const onLoginHandler = async () => {
  console.log('触发登录')
  loading.value = true
  // 发请求，获取token
  try {
    await userStore.login({
      ...loginForm.value,
      loginType: LOGIN_TYPE_USERNAME,
    })
    message('success', '登录成功！', 6000)
    // 修改路由过渡类型
    appStore.changeRouterType('push')
    // 路由跳转
    router.push('/')
  } catch (error) {
    message('error', error)
  }
  loading.value = false
}

/**
 * @description: 跳转到login
 */
const onToRegister = () => {
  // 修改路由过渡类型
  appStore.changeRouterType('push')
  router.push('/register')
}

/**
 * @description: navbar后退按钮
 */
const onBackClick = () => {
  console.log('first')
  // 修改路由过渡类型
  appStore.changeRouterType('back')
  router.back()
}
</script>

<style lang="scss" scoped></style>
