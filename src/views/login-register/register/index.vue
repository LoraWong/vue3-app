<template>
  <div class="flex justify-center items-center bg-slate-200 h-full">
    <div
      class="bg-gradient-to-l from-[#FF4B2B] to-[#FF416C] xl:bg-white dark:bg-zinc-800 w-full h-full xl:w-[768px] xl:h-[600px] overflow-hidden xl:rounded-lg xl:shadow-lg relative"
    >
      <m-svg-icon name="logo" class="absolute top-3 left-5 xl:hidden"></m-svg-icon>
      <div class="absolute left-0 bottom-0 w-full xl:w-[50%] h-[80%] xl:h-full z-20">
        <img
          src="@/assets/avatar.png"
          class="absolute left-[50%] translate-x-[-50%] translate-y-[-50%] w-6 h-6 rounded-full xl:hidden"
        />
        <vee-form
          action="#"
          class="bg-white flex items-center justify-center flex-col h-full px-5 py-8 text-center rounded-t-3xl xl:rounded-none"
          @submit="onRegisterHandler"
        >
          <h3 class="mb-2 font-semibold text-base text-zinc-800 dark:text-zinc-300">注册账号</h3>
          <!-- 用户名 -->
          <vee-field
            type="text"
            placeholder="用户名"
            name="username"
            autocomplete="on"
            class="login-input"
            :rules="validateUsername"
            v-model="regForm.username"
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
            v-model="regForm.password"
          />
          <!-- 错误提示 -->
          <vee-error-message
            class="text-sm text-red-600 block mt-0.5 text-left self-end"
            name="confirmPassword"
          ></vee-error-message>
          <!-- 确认密码 -->
          <vee-field
            type="password"
            placeholder="确认密码"
            name="confirmPassword"
            autocomplete="on"
            class="login-input"
            rules="validateConfirmPassword:@password"
            v-model="regForm.confirmPassword"
          />
          <!-- 错误提示 -->
          <vee-error-message
            class="text-sm text-red-600 block mt-0.5 text-left self-end"
            name="confirmPassword"
          ></vee-error-message>
          <div class="pb-3 leading-[0px] text-right">
            <a
              class="inline-block p-1 text-main text-right dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 text-sm duration-400 cursor-pointer"
              @click="onToLogin"
            >
              已经账号？去登录
            </a>
          </div>
          <div class="text-center flex space-x-1 mb-1">
            <vee-field
              type="checkbox"
              v-slot="{ field }"
              name="agree"
              :rules="validateAgreement"
              :value="true"
            >
              <input type="checkbox" name="agree" v-bind="field" :value="true" />
            </vee-field>
            <a
              class="text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 text-xs duration-400"
              target="__black"
            >
              注册即同意《用户注册协议》
            </a>
          </div>
          <!-- 错误提示 -->
          <vee-error-message
            class="text-sm text-red-600 block mt-0.5 text-left self-end"
            name="agree"
          ></vee-error-message>
          <m-button
            :loading="loading"
            class="w-[50%] dark:bg-zinc-900 xl:dark:bg-zinc-800 rounded-lg bg-gradient-to-l from-[#FF4B2B] to-[#FF416C]"
            >注册
          </m-button>
        </vee-form>
      </div>
      <div class="absolute right-0 w-[50%] h-[100%] overflow-hidden z-30 hidden xl:block">
        <div
          class="h-[100%] bg-gradient-to-l from-[#FF4B2B] to-[#FF416C] text-white flex justify-center items-center"
        >
          <div class="flex justify-center items-center flex-col text-center">
            <router-link to="/">
              <m-svg-icon name="logo" class="absolute top-5 cursor-pointer"></m-svg-icon>
            </router-link>
            <h1>Hello, Friend!</h1>
            <p class="text-base">Enter your personal details and start journey with us</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from '@/libs'
import {
  Form as VeeForm,
  Field as VeeField,
  ErrorMessage as VeeErrorMessage,
  defineRule,
} from 'vee-validate'
import {
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validateAgreement,
} from '../validator.js'
import { useUserStore } from '@/store/modules/user.js'
import { LOGIN_TYPE_USERNAME } from '@/constants'

const router = useRouter()
const userStore = useUserStore()

/**
 * 插入规则
 */
defineRule('validateConfirmPassword', validateConfirmPassword)

// 数据源
const regForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAgree: false,
})
// loading
const loading = ref(false)

/**
 * @description: 注册行为
 */
const onRegisterHandler = async () => {
  loading.value = true
  try {
    const payload = {
      username: regForm.value.username,
      password: regForm.value.password,
    }
    // 发请求注册
    await userStore.register(payload)
    // 发请求登录
    await userStore.login({ ...payload, loginType: LOGIN_TYPE_USERNAME })
    message('success', `欢迎您，${regForm.value.username}，注册成功！`, 6000)
    // 路由跳转到首页
    router.push('/')
  } catch (error) {
    message('error', error)
  }
  loading.value = false
}

/**
 * @description: 跳转到 register
 */
const onToLogin = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped></style>
