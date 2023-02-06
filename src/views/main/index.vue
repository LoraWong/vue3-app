<template>
  <div
    ref="containerTarget"
    class="h-full overflow-auto bg-white dark:bg-zinc-800 duration-500 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent xl:scrollbar-thumb-zinc-200 xl:dark:scrollbar-thumb-zinc-900"
  >
    <header-vue v-if="isMobileTerminal" />
    <navigation-vue />
    <div class="max-w-screen-xl mx-auto relative m-1 xl:mt-6">
      <list-vue />
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
}
</script>

<script setup>
import NavigationVue from './components/navigation/index.vue'
import ListVue from './components/list/index.vue'
import HeaderVue from '@/views/layout/components/Header/index.vue'
import { isMobileTerminal } from '@/utils/flexible'
import { useUserStore } from '@/store/modules/user.js'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app.js'
import { useScroll } from '@vueuse/core'
import { onActivated, ref } from 'vue'

const appStore = useAppStore()

const userStore = useUserStore()
const router = useRouter()

console.log('main')

/**
 * @description: 缓存页面滚动位置
 * 路由缓存页面默认滚到最上方，如何保留原来的滚动位置：记录页面滚动位置，路由组件激活后，修改dom的scrollTop属性值
 */
const containerTarget = ref(null)
// 页面滚动位置
const { y: containerTargetScrollY } = useScroll(containerTarget)

onActivated(() => {
  if (!containerTarget.value) return
  // 修改dom的scrollTop属性值
  containerTarget.value.scrollTop = containerTargetScrollY.value
})
</script>

<style lang="scss" scoped></style>
