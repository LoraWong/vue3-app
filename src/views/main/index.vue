<template>
  <div
    class="h-full overflow-auto bg-white dark:bg-zinc-800 duration-500 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent xl:scrollbar-thumb-zinc-200 xl:dark:scrollbar-thumb-zinc-900"
  >
    <header-vue v-if="isMobileTerminal"/>
    <navigation-vue />
    <div class="max-w-screen-xl mx-auto relative m-1 xl:mt-6">
      <list-vue />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainVue',
}
</script>

<script setup>
import NavigationVue from './components/navigation/index.vue'
import ListVue from './components/list/index.vue'
import HeaderVue from '@/views/layout/components/Header/index.vue'
import { isMobileTerminal } from '@/utils/flexible'

</script>

<style lang="scss" scoped></style>
