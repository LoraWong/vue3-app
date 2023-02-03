<template>
  <div class="relative" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
    <!-- 具名插槽：触发弹出层 -->
    <div ref="referenceTarget">
      <slot name="reference" />
    </div>
    <!-- 匿名插槽：弹出层内容 -->
    <transition name="popoverSlide">
      <div
        ref="contentTarget"
        v-show="isVisible"
        class="absolute p-1 z-50 bg-white dark:bg-zinc-900 dark:border-zinc-700 rounded-md border"
        :style="contentStyle"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>
<script>
/**
 * @description: 可控展示位置
 */
const PROP_TOP_LEFT = 'top-left'
const PROP_TOP_RIGHT = 'top-right'
const PROP_BOTTOM_LEFT = 'bottom-left'
const PROP_BOTTOM_RIGHT = 'bottom-right'
const PROP_BOTTOM_MIDDLE = 'bottom-middle'
const PROP_TOP_MIDDLE = 'top-middle'
const PROP_LEFT_MIDDLE = 'left-middle'
const PROP_RIGHT_MIDDLE = 'right-middle'

const placementEnum = [
  PROP_TOP_LEFT,
  PROP_TOP_RIGHT,
  PROP_BOTTOM_LEFT,
  PROP_BOTTOM_RIGHT,
  PROP_BOTTOM_MIDDLE,
  PROP_TOP_MIDDLE,
  PROP_LEFT_MIDDLE,
  PROP_RIGHT_MIDDLE,
]

/**
 * @description: 控制弹出层延时关闭时长
 */
const DELAY_TIME = 100
</script>
<script setup>
import { nextTick, ref, watch } from 'vue'

import {} from 'vue-router'

// 控制弹出层显示位置：
// 指定可选位置的常量，生成enum
// 指定 props
// 获取元素，创建读取元素尺寸的方法
// 生成 class样式对象（top left

const props = defineProps({
  placement: {
    type: String,
    default: PROP_BOTTOM_MIDDLE,
    // 输入合法性校验
    validator: (val) => {
      const isAvailable = placementEnum.includes(val)
      if (!isAvailable) {
        throw new TypeError(`the placement is must be one of ${placementEnum.join(',')}`)
      }
      return isAvailable
    },
  },
})

/**
 * @description: 控制弹出层显示隐藏：鼠标移入 展示弹出层；鼠标移出 隐藏弹出层
 */
const isVisible = ref(false)
let timeout = null
const onMouseenter = () => {
  isVisible.value = true
  // 清除定时器
  if (timeout) {
    clearTimeout(timeout)
  }
}
const onMouseleave = () => {
  // 延时关闭 弹出层
  timeout = setTimeout(() => {
    isVisible.value = false
  }, DELAY_TIME)
}

const referenceTarget = ref(null)
const contentTarget = ref(null)
/**
 * @description: 计算元素尺寸（保存元素信息，减少获取元素的次数，优化性能
 */
const useElementSize = (target) => {
  if (!target) return {}
  return {
    width: target.offsetWidth,
    height: target.offsetHeight,
  }
}

/**
 * @description: 弹出层 位置
 */
const contentStyle = ref({
  top: 0,
  left: 0,
})

/**
 * @description: 计算弹出层位置（在弹出层显示之后才能计算，所以要监听isVisible，如果弹出层还没显示，那么弹出层的宽高都是0
 */
watch(
  isVisible,
  (val) => {
    // 弹出层不显示，则不进行计算
    if (!val) return
    // 虽然使用v-show，但元素初次渲染时，还是需要nextTick，否则无法获取到元素
    nextTick(() => {
      // 获取元素宽高
      const contentTargetSize = useElementSize(contentTarget.value)
      const referenceTargetSize = useElementSize(referenceTarget.value)
      // 根据 placement 计算弹出层位置
      switch (props.placement) {
        // 左上
        case PROP_TOP_LEFT:
          contentStyle.value.top = `${-contentTargetSize.height}px`
          contentStyle.value.left = `${-contentTargetSize.width}px`
          break

        // 右上
        case PROP_TOP_RIGHT:
          contentStyle.value.top = `${-contentTargetSize.height}px`
          contentStyle.value.left = `${referenceTargetSize.width}px`
          break

        // 左下
        case PROP_BOTTOM_LEFT:
          contentStyle.value.top = `${referenceTargetSize.height}px`
          contentStyle.value.left = `${-contentTargetSize.width}px`
          break

        // 右下
        case PROP_BOTTOM_RIGHT:
          contentStyle.value.top = `${referenceTargetSize.height}px`
          contentStyle.value.left = `${referenceTargetSize.width}px`
          break

        // 下中
        case PROP_BOTTOM_MIDDLE:
          contentStyle.value.top = `${referenceTargetSize.height}px`
          contentStyle.value.left = `${
            referenceTargetSize.width / 2 - contentTargetSize.width / 2
          }px`
          break
        // 上中
        case PROP_TOP_MIDDLE:
          contentStyle.value.top = `${contentTargetSize.height}px`
          contentStyle.value.left = `${
            referenceTargetSize.width / 2 - contentTargetSize.width / 2
          }px`
          break

        // 左中
        case PROP_LEFT_MIDDLE:
          contentStyle.value.top = `${
            referenceTargetSize.height / 2 - contentTargetSize.height / 2
          }px`
          contentStyle.value.left = `${-contentTargetSize.width}px`
          break
        // 右中
        case PROP_RIGHT_MIDDLE:
          contentStyle.value.top = `${
            referenceTargetSize.height / 2 - contentTargetSize.height / 2
          }px`
          contentStyle.value.left = `${referenceTargetSize.width}px`
          break
      }
    })
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped></style>
