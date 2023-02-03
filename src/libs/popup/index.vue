<template>
  <div>
    <teleport to="body">
      <!--teleport 中的元素被渲染到 body之下  -->
      <!-- mask -->
      <transition name="fade">
        <div
          v-if="isVisible"
          class="w-screen h-screen bg-zinc-900/50 z-40 fixed top-0 left-0"
          @click="onClose"
        >
        </div>
      </transition>
      <!-- content -->
      <transition name="pop-down-up">
        <div
          v-if="isVisible"
          v-bind="$attrs"
          class="w-screen bg-zinc-50 dark:bg-zinc-800 z-50 fixed bottom-0"
        >
          <!-- slot 显示什么内容 由父组件决定 -->
          <slot></slot>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import {  watch } from 'vue'
import { useScrollLock, useVModel } from '@vueuse/core'

import {} from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

/**
 * @description: 关闭 或 打开 popup
 */
const emit = defineEmits(['update:modelValue'])

// useVModel 生成一个响应式的 props数据，当数据变化时，会自动触发 update:modelValue 事件
const isVisible = useVModel(props)

/**
 * @description 锁定滚动（响应式数据
 */
const isScrollLock = useScrollLock(document.body) // 是否锁定滚动（响应式数据

watch(
  isVisible,
  (val) => {
    // popup 显示 ， 锁定滚动
    isScrollLock.value = val
  },
  { immediate: true }
)

/**
 * 点击mask 关闭 popup
 */
const onClose = () => {
  // emit('update:modelValue', false)
  // 当数据变化时，会自动触发 update:modelValue 事件
  isVisible.value = false
}
</script>

<style lang="scss" scoped>


.pop-down-up-enter-active,
.pop-down-up-leave-active {
  transition: all 0.3s ease;
}
.pop-down-up-enter-from,
.pop-down-up-leave-to {
  /* 向下移动 100% */
  transform: translateY(100%);
}
</style>
