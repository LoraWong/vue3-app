<template>
  <div class="xl:h-header w-full bg-gradient px-1 py-1 duration-500">
    <div class="flex items-center flex-wrap">
      <m-svg-icon
        name="logo"
        class="xl:h-3 xl:w-16 h-2 cursor-pointer mr-5 ml-1"
        fillClass="dark:fill-zinc-300"
        @click="onToHome"
      ></m-svg-icon>
      <header-search-vue class="mr-1 w-4/5 xl:w-6/12" />
      <div class="flex-auto"></div>
      <header-theme-vue />
      <header-my-vue v-if="!isMobileTerminal" />
      <router-link
        v-if="isMobileTerminal && userStore.hasUserInfo"
        :to="`/profile/${userStore.userInfo.username}}`"
      >
        <img :src="userStore.userInfo.avatar" class="block w-3 h-3 rounded-full" />
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Header',
}
</script>
<script setup>
import headerSearchVue from './header-search/index.vue'
import headerThemeVue from './header-theme.vue'
import headerMyVue from './header-my.vue'
import { isMobileTerminal } from '@/utils/flexible'

import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app.js'
import { useUserStore } from '@/store/modules/user.js'

console.log('header')

const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()

/**
 * @description: logo点击事件， 跳转到首页
 */
const onToHome = () => {
  // 修改路由过渡类型
  appStore.changeRouterType('push')
  router.push('/')
}
</script>

<style lang="scss" scoped></style>
