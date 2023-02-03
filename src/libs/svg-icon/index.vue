<template>
  <svg aria-hidden="true">
    <use :xlink:href="symbolId" :class="fillClass" :fill="color"/>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

import {} from 'vue-router'

const props = defineProps({
  // 显示的svg
  name: {
    type: String,
    required: true
  },
  // svg 图标颜色
  color: {
    type: String
  },
  // tailwind svg类名
  fillClass: {
    type: String
  }
})

/**
 * 显示的 svg图标 （name拼接 #icon-
 */
const symbolId = computed(() => `#icon-${props.name}`)

</script>

<style lang="scss" scoped></style>
