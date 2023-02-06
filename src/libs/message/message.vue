<template>
  <transition name="down" @afterLeave="destroy">
    <div
      v-show="isVisible"
      class="min-w-40% fixed top-[20px] left-[50%] translate-x-[-50%] z-50 flex items-center px-3 py-1.5 rounded-sm border cursor-pointer"
      :class="styles[type].containerClass"
    >
      <m-svg-icon
        :name="styles[type].icon"
        :fillClass="styles[type].fillClass"
        class="h-1.5 w-1.5 mr-1.5"
      ></m-svg-icon>
      <span class="text-sm" :class="styles[type].textClass">
        {{ content }}
      </span>
    </div>
  </transition>
</template>

<script>
// message 类型
const SUCCESS = 'success'
const ERROR = 'error'
const WARN = 'warn'
const typeEnum = [SUCCESS, ERROR, WARN]
</script>

<script setup>
import { onMounted, ref } from 'vue'
import mSvgIcon from '@/libs/svg-icon/index.vue'

const props = defineProps({
  // message 类型
  type: {
    type: String,
    required: true,
    validator(val) {
      const isFind = typeEnum.includes(val)
      if (!isFind) {
        throw new Error(`the message type is must be one of ${typeEnum.join(', ')}`)
      }
      return isFind
    },
  },
  // 提示文本
  content: {
    type: String,
    required: true,
  },
  // 展示时长
  duration: {
    type: Number,
  },
  // 关闭回调
  destroy: {
    type: Function,
  },
})

/**
 * @description: 样式表
 */
const styles = {
  // 警告
  warn: {
    icon: 'warn',
    fillClass: 'fill-warn-300',
    textClass: 'text-warn-300',
    containerClass: 'bg-warn-100 border-warn-200  hover:shadow-lg hover:shadow-warn-100',
  },
  // 错误
  error: {
    icon: 'error',
    fillClass: 'fill-error-300',
    textClass: 'text-error-300',
    containerClass: 'bg-error-100 border-error-200  hover:shadow-lg hover:shadow-error-100',
  },
  // 成功
  success: {
    icon: 'success',
    fillClass: 'fill-success-300',
    textClass: 'text-success-300',
    containerClass: 'bg-success-100 border-success-200  hover:shadow-lg hover:shadow-success-100',
  },
}

// 控制message 显示与隐藏
const isVisible = ref(false)

/**
 * @description: 组件挂载后，显示message；一段时间后，隐藏message、
 * transition钩子 @after-leave：在离开过渡完成、且元素已从 DOM 中移除时调用
 * 过渡动画down-leave-to完成后，调用props.destroy(卸载组件)
 */
onMounted(() => {
  // 显示message
  isVisible.value = true
  // 一段时间后，隐藏message
  setTimeout(() => {
    isVisible.value = false
  }, props.duration)
})
</script>

<style lang="scss" scoped></style>
