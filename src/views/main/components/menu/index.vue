<template>
  <div class="py-2 h-[70vh] flex flex-col">
    <h3 class="text-base text-zinc-900 dark:text-zinc-300 font-bold mb-1 px-2">所有分类</h3>
    <ul class="overflow-y-scroll">
      <li
        v-for="(item, index) in categoryStore.category"
        :key="item.id"
        class="text-sm text-zinc-800 dark:text-zinc-300 py-1 px-2 dark:active:bg-zinc-200 active:bg-zinc-900/10 duration-100"
        :class="{ active: isActive }"
        @touchstart="isActive = true"
        @touchend="isActive = false"
        @click="$emit('onItemClick', item)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import {ref} from 'vue'

import {} from 'vue-router'
import { useCategoryStore } from '@/store/modules/category.js'

const categoryStore = useCategoryStore()
const isActive = ref(false)
// 注册事件
// 通知父组件 关闭 popup、重新获取数据进行展示
defineEmits(['onItemClick'])
</script>

<style lang="scss" scoped></style>
