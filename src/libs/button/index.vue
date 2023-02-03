<template>
  <button
    class="text-sm text-center flex items-center content-center justify-center rounded p-0.5 duration-150"
    :class="[typeEnum[type], sizeEnum[sizeKey].button, { 'active:scale-105': isActiveAnim }]"
    @click.stop="onBtnClick"
  >
    <!-- loading -->
    <m-svg-icon name="loading" v-if="loading" class="w-2 h-2 animate-spin"></m-svg-icon>
    <!-- icon -->
    <m-svg-icon
      :name="icon"
      v-if="icon"
      :class="sizeEnum[sizeKey].icon"
      :color="iconColor"
      :fillClass="iconClass"
    ></m-svg-icon>
    <!-- 文字 -->
    <slot />
  </button>
</template>

<script>
// style :按钮风格
const typeEnum = {
  primary:
    'text-white  bg-zinc-800 dark:bg-zinc-900 hover:bg-zinc-900 dark:hover:bg-zinc-700 active:bg-zinc-800 dark:active:bg-zinc-700',
  main: 'text-white  bg-main dark:bg-zinc-900 hover:bg-hover-main dark:hover:bg-zinc-700 active:bg-main dark:active:bg-zinc-700',
  info: 'text-zinc-800  dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-700  hover:bg-zinc-300 dark:hover:bg-zinc-600 active:bg-zinc-200 dark:active:bg-zinc-700',
}
//  size ： 按钮大小（区分 icon 和 text
const sizeEnum = {
  // 文字按钮
  // 默认大小
  default: {
    // 按钮大小
    button: 'w-8 h-4 text-base',
    // icon图标大小
    icon: '',
  },
  // small
  small: {
    button: 'w-7 h-3 text-sm',
    icon: '',
  },
  // icon 按钮
  'icon-default': {
    button: 'w-4 h-4',
    icon: 'w-1.5 h-1.5',
  },

  'icon-small': {
    button: 'w-3 h-3',
    icon: 'w-1.5 h-1.5',
  },
}

const EMITS_CLICK = 'click'
</script>

<script setup>
import { computed } from 'vue'
import mSvgIcon from '@/libs/svg-icon/index.vue'
import {} from 'vue-router'

// 接收数据： 可选项 style 、 size
// 区分 icon button 和 text button
// 根据数据实现样式
// 处理点击事件

const emits = defineEmits([EMITS_CLICK])

const props = defineProps({
  // icon 图标
  icon: String,
  // icon 颜色
  iconColor: String,
  // icon 图标类名（tailwind
  iconClass: String,
  // 按钮风格
  type: {
    type: String,
    default: 'main',
    // 验证 输入 是否合法
    validator: (v) => {
      // 获取 所有 style
      const types = Object.keys(typeEnum)
      //  开发者指定的 style 是否在 可选项？
      const isAvailable = types.includes(v)
      if (!isAvailable) {
        // 提示
        throw new TypeError(`the type must be one of ${types.join(', ')}`)
      }
      return isAvailable
    },
  },
  // 按钮大小
  size: {
    type: String,
    default: 'default',
    // 验证 输入 是否合法
    validator: (v) => {
      // 获取 所有 size
      // 筛选出 所有 不包含 icon 的 size名称
      const sizes = Object.keys(sizeEnum).filter((item) => !item.includes('icon'))
      //  开发者指定的 size 是否在 可选项？
      const isAvailable = sizes.includes(v)
      if (!isAvailable) {
        // 提示
        throw new TypeError(`the size must be one of ${sizes.join(', ')}`)
      }
      return isAvailable
    },
  },
  // 点击时是否有动画
  isActiveAnim: {
    type: Boolean,
    default: true,
  },
  // loading效果
  loading: {
    type: Boolean,
    default: false,
  },
})

/**
 * @description: 区分 icon 和 text 的 size处理
 */
const sizeKey = computed(() => {
  // 如果 传入了 icon ，则用户使用icon 按钮，则size的名称 为 icon-xxx
  return props.icon ? 'icon-' + props.size : props.size
})

/**
 * @description: 点击事件
 */

const onBtnClick = () => {
  if (props.loading) return
  // 触发 点击回调
  emits(EMITS_CLICK)
}
</script>

<style lang="scss" scoped></style>
