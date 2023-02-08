<template>
  <div>
    <slot :duration="showTime">
      <!-- 设计插槽，默认内容为span，使用者也可以自定义 -->
      <span>{{ showTime }}</span>
    </slot>
  </div>
</template>

<script>
// 倒计时结束
const EMITS_FINISH = 'finish'
// 倒计时改变
const EMITS_CHANGE = 'change'
// 倒计时间间隔(1000毫秒)
const INTERVAL_COUNT = '1000'

export default {
  name: 'count-down',
}
</script>

<script setup>
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import dayjs from './utils'

const props = defineProps({
  //倒计时时长，时间戳（ 毫秒
  time: {
    type: Number,
    required: true,
  },
  // 时间格式，遵循 dayjs format 标准：https://day.js.org/docs/zh-CN/parse/string-format
  format: {
    type: String,
    default: 'HH:mm:ss',
  },
})

// 该倒计时应该提供两个事件：change：倒计时改变、finish：倒计时结束
const emits = defineEmits([EMITS_FINISH, EMITS_CHANGE])
// 要显示的倒计时时间
const duration = ref(0)

/**
 * @description: 时间格式处理
 */
const showTime = computed(() => {
  return dayjs.duration(duration.value).format(props.format)
})

/**
 * @description: 开始倒计时
 */
let timer
const start = () => {
  close()
  // 开启定时器
  timer = setInterval(() => {
    durationFn()
  }, INTERVAL_COUNT)
}

/**
 * @description: 倒计时执行的函数
 */
const durationFn = () => {
  // 修改倒计时时间(毫秒数，每次 -1000)
  duration.value -= INTERVAL_COUNT
  // 触发倒计时改变回调
  emits(EMITS_CHANGE)
  // 倒计时是否结束
  if (duration.value <= 0) {
    duration.value = 0
    // 触发倒计时结束回调
    emits(EMITS_FINISH)
    close()
  }
}

/**
 * @description: 结束倒计时
 */
const close = () => {
  // 清除定时器
  clearInterval(timer)
}

/**
 * @description: 监听prop，prop传入后开启倒计时
 */
watch(
  () => props.time,
  (val) => {
    // 保存倒计时时间
    duration.value = val
    // 开启倒计时
    start()
  },
  { immediate: true }
)

/**
 * @description: 注意！！组件销毁前，清理定时器
 * （用于倒计时过程中，用户退出组件
 */
onBeforeUnmount(close)

</script>

<style lang="scss" scoped></style>
