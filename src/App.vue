<template>
  <div class="h-full w-screen fixed top-0 left-0" ref="containerTarget">
    <m-transition-router-view
      :routerType="appStore.currentRouterType"
      mainComponentName="home"
    ></m-transition-router-view>
    <!-- tabBar -->
    <m-trigger-menu
      v-if="isMobileTerminal && !$route.meta.noTarBar"
      class="fixed bottom-0 m-auto left-0 right-0 w-[220px] z-50 bg-gradient"
    >
      <m-trigger-menu-item
        icon="home"
        iconClass="fill-zinc-900 dark:fill-zinc-500"
        textClass="text-zinc-800 dark:text-zinc-500"
        @click="onHomeClick"
      >
        首页
      </m-trigger-menu-item>
      <m-trigger-menu-item
        v-if="userStore.hasUserInfo"
        icon="vip"
        iconClass="fill-zinc-900 dark:fill-zinc-500"
        textClass="text-zinc-800 dark:text-zinc-500"
        @click="onVipClick"
      >
        VIP
      </m-trigger-menu-item>
      <m-trigger-menu-item
        icon="profile"
        iconClass="fill-zinc-900 dark:fill-zinc-500"
        textClass="text-zinc-800 dark:text-zinc-500"
        @click="onMyClick"
      >
        {{ userStore.hasUserInfo ? '我的' : '去登录' }}
      </m-trigger-menu-item>
    </m-trigger-menu>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRem } from './utils/flexible'
import { useThrottleFn } from '@vueuse/core'
import { useAppStore } from '@/store/modules/app.js'
import { isMobileTerminal } from '@/utils/flexible'
import { useUserStore } from '@/store/modules/user.js'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()

const containerTarget = ref(null)

/**
 * @description: 监听浏览器窗口尺寸，尺寸变化重新计算rem
 * @return {*}
 */
// 节流
const throttledFn = useThrottleFn(() => {
  useRem()
}, 300)

onMounted(() => {
  window.addEventListener('resize', throttledFn)
})

const onHomeClick = () => {
  if (route.path === '/') {
    // 回到顶部
    //  修改dom的scrollTop属性值
    containerTarget.value.scrollTop = 0
    console.log('🚀 ~ file: App.vue:75 ~ onHomeClick ~ 回到顶部', '回到顶部')
  }

  // 修改路由过渡类型
  appStore.changeRouterType('back')
  router.push('/')
}

const onVipClick = () => {
  // 修改路由过渡类型
  appStore.changeRouterType('push')
  router.push('/member')
}

const onMyClick = () => {
  const path = userStore.hasUserInfo ? `/profile/${userStore.userInfo?.username}` : '/login'
  // 修改路由过渡类型
  appStore.changeRouterType('push')
  router.push(path)
}
</script>

<style lang="scss" scoped></style>
