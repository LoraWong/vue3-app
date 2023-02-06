<template>
  <div>
    <!-- 内容 -->
    <slot />
    <!-- list底部的目标元素，出现在视口后 开启loading，开始请求数据，数据请求成功后，修改loading为false -->
    <div ref="loadingTarget" class="h-6 py-4">
      <!-- 加载更多 -->
      <m-svg-icon
        name="infinite-load"
        class="w-4 h-4 mx-auto animate-spin"
        v-show="modelValue"
      ></m-svg-icon>
      <!-- 没有更多数据 -->
      <p v-if="isFinished" class="text-center text-base text-zinc-400">No More Data!</p>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  // 是否处于加载状态(loading)
  modelValue: {
    type: Boolean,
    required: true,
  },
  // 是否全部加载完成
  isFinished: {
    type: Boolean,
    default: false,
  },
})

/**
 * @description: 声明自定义事件
 * @method onLoad: 目标元素 出现在 视口 的 回调
 * @method update: 双向数据绑定：loading 状态
 */
const emits = defineEmits(['onLoad', 'update:modelValue'])

/**
 * @description: 监听 目标元素 出现在 viewport 中，执行回调
 * @param {*} isIntersecting :目标元素 是否 可见
 */
// 目标元素
const loadingTarget = ref(null)
// 目标元素是否 可见
const isIntersectingTarget = ref(false)
useIntersectionObserver(loadingTarget, ([{ isIntersecting }]) => {
  isIntersectingTarget.value = isIntersecting
  // 触发 loading
  onLoad()
})

/**
 * @description: 触发loading
 * 为什么延迟触发 load（使用定时器）？等待页面渲染
 * 数据请求回来后，loading 值被修改，会立即触发watch，但此时isIntersecting 仍为 true（因为渲染/图片加载需要时间，页面还没铺满），会再次执行 load，发起请求
 */
const onLoad = () => {
  // 目标元素可见， 且目标元素未加载 ，且还有数据需要加载时，开启loading
  setTimeout(() => {
    if (isIntersectingTarget.value && !props.modelValue && !props.isFinished) {
      // 加载 视图： loading 改为 true
      // 通知父组件 修改 modelValue 为 true
      emits('update:modelValue', true)
      // 触发 加载 回调
      emits('onLoad')
    }
  }, 500)
}

/**
 * @description: 监听 loading变化（解决： 数据无法 加载满 全屏时，后续数据无法继续加载
 * 原因：触发 IntersectionObserver回调后，数据无法铺满全屏，此时isIntersecting 仍为 true，但是 IntersectionObserver只会被触发一次，并不会再次触发
 * 解决：监听 loading变化，只要 目标元素可见，就触发 loading（确保 loading 可以被多次触发
 * 存在的问题：如果数据可以铺满全屏，load会被重复触发。因为数据请求回来后，loading 值被修改，会立即触发watch，但此时isIntersecting 仍为 true（因为页面渲染/图片加载需要时间，页面还没铺满），会再次执行 load，发起请求
 * 解决：nextTick无效? 1.v-show不会引发元素重新渲染，nextTick无效；2.即使不用v-show，此nextTick只能确保loading更新后的元素渲染，不能确保 开发者的组件数据更新后的元素渲染
 *  延迟触发 load（使用定时器）
 */
watch(() => props.modelValue, onLoad)
</script>

<style lang="scss" scoped></style>
