<template>
  <mobile-navigation-vue v-if="isMobileTerminal" />
  <pc-navigation-vue v-else />
</template>
<script>
export default {
  name: 'NavigationVue',
}
</script>
<script setup>

import { isMobileTerminal } from '@/utils/flexible'
import MobileNavigationVue from './mobile/index.vue'
import PcNavigationVue from './pc/index.vue'
import { useCategoryStore } from '@/store/modules/category.js'

const categoryStore = useCategoryStore()

/**
 * 获取数据
 */
const getCategoryData = () => {
  categoryStore.setCategory()
}
getCategoryData()

console.log('navigation')
</script>

<style lang="scss" scoped></style>
