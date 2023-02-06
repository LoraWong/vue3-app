<template>
  <div>
    <!-- mask -->
    <transition name="fade">
      <div
        v-if="isVisible"
        @click="close"
        class="w-screen h-screen bg-zinc-900/80 z-40 fixed top-0 left-0"
      ></div>
    </transition>

    <!-- content -->
    <transition name="up">
      <div
        v-if="isVisible"
        class="w-[80%] xl:w-[35%] fixed top-1/3 left-[50%] translate-x-[-50%] z-50 px-2 py-1.5 rounded-sm border dark:border-zinc-600 cursor-pointer bg-white dark:bg-zinc-800"
      >
        <!-- 标题 -->
        <div class="text-lg font-bold text-zinc-900 dark:text-zinc-200 mb-2">
          {{ title }}
        </div>
        <!-- 内容 -->
        <div class="text-sm text-zinc-900 dark:text-zinc-200 mb-2">
          {{ content }}
        </div>
        <!-- 按钮 -->
        <div class="flex justify-end">
          <m-button type="info" size="small" class="mr-2" @click="onCancelClick">{{ cancelText }}</m-button>
          <m-button type="main" size="small" @click="onConfirmClick">{{ confirmText }}</m-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 通过方法进行调用，这会导致 自动导入的组件无法使用，所以我们需要手动导入需要使用到的通用组件
import mButton from '@/libs/button/index.vue'



const props = defineProps({
  // 标题
  title: {
    type: String,
  },
  // 描述
  content: {
    type: String,
    required: true,
  },
  // 取消按钮文本
  cancelText: {
    type: String,
    default: '取消',
  },
  // 确定按钮文本
  confirmText: {
    type: String,
    default: '确定',
  },
  // 取消按钮事件
  cancelHandler: {
    type: Function,
  },
  // 确定按钮事件
  confirmHandler: {
    type: Function,
  },
  // 关闭 confirm 的回调
  close: {
    type: Function,
  },
})

// 组件展示隐藏
const isVisible = ref(false)

/**
 * @description: 显示 confirm
 */
const show = () => {
  isVisible.value = true
}

//  组件挂载完毕，显示 confirm （确保动画有效
onMounted(show)

//  confirm 显示、关闭 动画执行时间
const duration = '0.5s'

/**
 * @description: 关闭 confirm
 */
const close = () => {
  isVisible.value = false
  // 使用定时器，预留时间，等 关闭动画执行后，再销毁组件
  // 也可以使用 transition钩子，等动画关闭后执行 props.close
  setTimeout(() => {
    if (props.close) {
      props.close()
    }
  }, parseInt(duration.replace('0.', '').replace('s', '') * 100))
}

/**
 * @description:  取消按钮
 */
const onCancelClick = () => {
  if (props.cancelHandler) {
    props.cancelHandler()
  }
  // 关闭
  close()
}

/**
 * @description: 确认按钮
 */
const onConfirmClick = () => {
  if (props.confirmHandler) {
    props.confirmHandler()
  }
  // 关闭
  close()
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all v-bind(duration);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.up-enter-active,
.up-leave-active {
  transition: all v-bind(duration);
}

.up-enter-from,
.up-leave-to {
  opacity: 0;
  transform: translate3d(-50%, 100px, 0);
}
</style>
