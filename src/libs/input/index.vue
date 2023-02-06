<template>
  <div class="relative">
    <input
      v-if="type === TYPE_TEXT"
      type="text"
      class="border-gray-200 dark:border-zinc-600 dark:bg-zinc-800 duration-100 dark:text-zinc-400 border-[1px] outline-0 py-0.5 px-1 text-sm rounded-sm focus:border-main w-full"
      :value="modelValue"
      :maxlength="max"
      @input="onInput"
    />
    <textarea
      v-if="type === TYPE_TEXTAREA"
      class="border-gray-200 dark:border-zinc-600 dark:bg-zinc-800 duration-100 dark:text-zinc-400 border-[1px] outline-0 py-0.5 px-1 text-sm rounded-sm focus:border-main w-full"
      :value="modelValue"
      :maxlength="max"
      rows="5"
      @input="onInput"
    ></textarea>
    <!-- 最大字符数提示 -->
    <span
      v-if="max"
      class="absolute right-1 bottom-0.5 text-zinc-400 text-xs"
      :class="{ 'text-red-700': currentNumber === parseInt(max) }"
      >{{ currentNumber }} / {{ max }}</span
    >
  </div>
</template>

<script>
const TYPE_TEXT = 'text'
const TYPE_TEXTAREA = 'textarea'
const typeEnum = [TYPE_TEXT, TYPE_TEXTAREA]
</script>

<script setup>
import { computed } from 'vue'

// 需求
/* 可以以单行输入（input）的形式展示
可以以多行输入（textarea）的形式展示
可以通过 v-model 绑定输入内容
支持设定最大字符数 */

const props = defineProps({
  // 双向绑定
  modelValue: {
    type: String,
    required: true,
  },
  // type：text || textarea
  type: {
    type: String,
    default: 'text',
    validate(val) {
      const isFind = typeEnum.includes(val)
      if (!isFind) {
        throw new Error(`the input type is must be one of ${typeEnum.join(', ')}`)
      }
      return isFind
    },
  },
  // 最大字符数
  max: {
    type: [String, Number],
  },
})

const emits = defineEmits(['update:modelValue'])

/**
 * @description: 输入的字符数
 */
const currentNumber = computed(() => {
  return props.modelValue.length
})

/**
 * @description: input事件
 */
const onInput = (e) => {
  emits('update:modelValue', e.target.value)
}
 
</script>

<style lang="scss" scoped></style>
