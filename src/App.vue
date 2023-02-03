<template>
  <div class=" h-full w-screen fixed top-0 left-0">
    <router-view />
  </div>
  
</template>

<script setup>
import { onMounted } from "vue"
import { useRem } from "./utils/flexible"
import { useThrottleFn } from "@vueuse/core"

/**
 * @description: 监听浏览器窗口尺寸，尺寸变化重新计算rem
 * @return {*}
 */
// 节流
const throttledFn = useThrottleFn(() => {
  useRem()
}, 300)

onMounted(() => {
  window.addEventListener("resize", throttledFn)
})
</script>

<style lang="scss" scoped></style>
