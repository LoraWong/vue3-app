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
import { ref } from 'vue'

import {} from 'vue-router'
import { isMobileTerminal } from '@/utils/flexible'
import MobileNavigationVue from './mobile/index.vue'
import PcNavigationVue from './pc/index.vue'
import { getCategory } from '@/api/category'
import { ALL_CATEGORY_ITEM } from '@/constants'
import { useCategoryStore } from '@/store/modules/category.js'

const categoryStore = useCategoryStore()

/**
 * 获取数据
 */
const getCategoryData = () => {
  categoryStore.setCategory()
}
getCategoryData()
</script>

<style lang="scss" scoped></style>
