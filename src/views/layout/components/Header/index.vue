<template>
  <div
    class="h-header w-full dark:bg-zinc-800 dark:bg-none bg-gradient-to-l to-white from-main px-2 py-1 duration-500"
  >
    <div class="flex items-center">
      <m-svg-icon
        name="logo"
        class="h-3 w-16 cursor-pointer mr-1 mt-2 ml-1"
        fillClass="dark:fill-zinc-300"
        @click="onToHome"
      ></m-svg-icon>
      <header-search-vue class="mr-1 w-6/12" />
      <div class="flex-auto"></div>
      <header-theme-vue class="mr-1" />
      <header-my-vue />
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
import {} from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * @description: logo点击事件， 跳转到首页
 */
const onToHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped></style>
