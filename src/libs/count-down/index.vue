<template>
  <div></div>
</template>

<script>
// 倒计时结束
const EMITS_FINISH = 'finish'
// 倒计时改变
const EMITS_CHANGE = 'change'
</script>

<script setup>
import {} from 'vue'

const props = defineProps({
  // 毫秒
  time: {
    type: Number,
    required: true,
  },
  // 遵循 dayjs format 标准：https://day.js.org/docs/zh-CN/parse/string-format
  format: {
    type: String,
    default: 'HH:mm:ss',
  },
})

// 该倒计时应该提供两个事件：change：倒计时改变、finish：倒计时结束
const emits = defineEmits([EMITS_FINISH, EMITS_CHANGE])



</script>

<style lang="scss" scoped></style>
