<template>
  <div>
    <div
      v-for="(item, index) in hintData"
      :key="index"
      class="py-1 pl-1 text-sm font-bold text-zinc-500 rounded cursor-pointer duration-300 hover:bg-zinc-200 dark:hover:bg-zinc-900"
      @click="onItemClick(item)"
    >
      <span class="text-main dark:text-zinc-200">{{props.searchText}}</span>{{ highlightText(item) }}
    </div>
  </div>
</template>
<script>
const EMIT_ITEM_CLICK = 'onItemClick'
</script>
<script setup>
import { ref } from 'vue'
import { getHint } from '@/api/pixels.js'
import { watchDebounced } from '@vueuse/core'

const props = defineProps({
  // 搜索文本
  searchText: {
    type: String,
    required: true,
  },
})

const emits = defineEmits([EMIT_ITEM_CLICK])

// 数据源
const hintData = ref([])

/**
 * @description: 获取 搜索提示 数据源
 */
const getHintData = async () => {
  if (!props.searchText) return
  const { result } = await getHint(props.searchText)
  hintData.value = result
}

/**
 * @description: 文字高亮
 */
 const highlightText = (text) => {
  // 构建正则表达式，从《显示文本中》找出与《用户输入文本相同的内容》，使用《高亮标签》进行替换
  const reg = new RegExp(props.searchText, 'gi')
  // 替换
  return text.replace(reg, '')
}

/**
 * @description: 监听搜索文本变化
 */
watchDebounced(
  () => props.searchText,
  (newValue) => {
    getHintData(newValue)
  },
  {
    immediate: true,
    // watch回调触发 延迟时间
    debounce: 500,
  }
)

/**
 * @description: 点击 搜索提示
 */
const onItemClick = (item) => [
  // 触发 父组件中的搜索回调
  emits(EMIT_ITEM_CLICK, item),
  // 清空 数据
  hintData.value = []
]
</script>

<style lang="scss" scoped></style>
