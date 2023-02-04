<template>
  <div class="relative group" ref="containerTargetRef">
    <div>
      <!-- 搜索图标 -->
      <m-svg-icon
        name="search"
        class="w-1.5 h-1.5 absolute top-[50%] translate-y-[-50%] left-2 z-10"
        fillClass="dark:fill-zinc-300"
      ></m-svg-icon>
      <!-- 输入框 -->
      <input
        type="text"
        placeholder="Search..."
        class="search-input-blur block w-full h-[40px] pl-5 pr-5 outline-none placeholder:italic placeholder:text-zinc-400 text-base text-slate-400 duration-500 focus:shadow-sm focus:shadow-zinc-500/50 focus:placeholder:text-zinc-900 hover:shadow-sm hover:shadow-zinc-50/90"
        :value="modelValue"
        @change="onChangeHandler"
        @keyup.enter="onSearchHandler"
        @focus="onFocusHandler"
        @blur="onBlurHandler"
        @input="onInputHandler"
      />
      <!-- 删除按钮 -->
      <span
        v-show="modelValue"
        class="flex items-center justify-center h-3 w-3 absolute top-[50%] translate-y-[-50%] right-6 z-10 cursor-pointer duration-500"
        @click="onClearClick"
      >
        <m-svg-icon
          name="input-delete"
          class="h-1.5 w-1.5"
          fillClass="dark:fill-zinc-300"
        ></m-svg-icon>
      </span>
      <!--搜索按钮 (通用组件)-->
      <m-button
        icon="search"
        iconColor="#fff"
        size="small"
        class="absolute top-[50%] translate-y-[-50%] right-2 z-20 rounded-full opacity-0 group-hover:opacity-100 duration-500"
        @click="onSearchHandler"
      ></m-button>
    </div>
    <!--下拉框 -->
    <transition name="slide">
      <div
        class="max-h-[368px] w-full text-base overflow-y-auto bg-white dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-600 absolute top-[46px] left-0 z-40 p-2 rounded border border-zinc-200 duration-200 hover:shadow-lg"
        v-show="showDropdown"
      >
        <slot name="dropdown"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
const EMIT_UPDATE_MODEL_VALUE = 'update:modelValue'
const EMIT_INPUT = 'input'
const EMIT_CLEAR = 'clear'
const EMIT_SEARCH = 'search'
const EMIT_CHANGE = 'change'
const EMIT_FOCUS = 'focus'
const EMIT_BLUR = 'blur'
</script>
<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
// 输入内容实现 双向数据绑定
// hover 展示 搜索按钮
// 清空 input框内容、input框有数据则展示删除按钮
// input事件： 触发搜索、focus事件、blur事件、change事件
// 控制 下拉框展示(input聚焦则展示、失去焦点则隐藏、点击header search区域则外隐藏)
// 事件处理

/**
 * @description: 输入内容实现 双向数据绑定
 */
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})
const emits = defineEmits([
  EMIT_UPDATE_MODEL_VALUE,
  EMIT_INPUT,
  EMIT_CLEAR,
  EMIT_SEARCH,
  EMIT_CHANGE,
  EMIT_FOCUS,
  EMIT_BLUR,
])
// 收集 input 数据
const inputValue = ref('')

/**
 * @description: 控制 下拉框展示(input聚焦则展示、点击header search区域则外隐藏)
 */
const showDropdown = ref(false)

/**
 * @description: focus事件
 */
const onFocusHandler = () => {
  // input聚焦则展示
  showDropdown.value = true
  emits(EMIT_FOCUS)
}
//  点击区域则外隐藏（使用 vueuse 绑定一个区域外点击事件
// 获取 header search元素
// const containerTargetRef = ref(null)
// onClickOutside(containerTargetRef, () => {
//   showDropdown.value = false
// })

/**
 * @description: blur 事件
 *  input失去焦点，隐藏 下拉框
 */
const onBlurHandler = () => {
  emits(EMIT_BLUR, props.modelValue)
  showDropdown.value = false
}

/**
 * @description: input 事件
 */
const onInputHandler = (e) => {
  // 通知父组件 修改 input数据
  console.log('input change')
  emits(EMIT_UPDATE_MODEL_VALUE, e.target.value)
  emits(EMIT_INPUT)
}

/**
 * @description: change 事件
 */
const onChangeHandler = () => {
  emits(EMIT_CHANGE)
}

/**
 * @description: 清空 input框内容
 */
const onClearClick = () => {
  // 通知父组件 清空 input数据
  emits(EMIT_UPDATE_MODEL_VALUE, '')
  emits(EMIT_CLEAR)
}

/**
 * @description: 触发搜索
 */
const onSearchHandler = () => {
  // 通知 父组件 触发 搜索回调
  emits(EMIT_SEARCH, props.modelValue)
  console.log('🚀 ~ file: index.vue:157 ~ onSearchHandler ~ props.modelValue', props.modelValue)
}
</script>

<style lang="scss" scoped>
.search-input-blur {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  /* box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px; */
  border-radius: 20px;
  -webkit-border-radius: 20px;
}
</style>
