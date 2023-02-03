<template>
  <div class="relative" ref="containerTarget" :style="{ height: containerHeight + 'px' }">
    <!-- item -->
    <template v-if="columnWidth && data.length">
      <div
        v-for="(item, index) in data"
        :key="nodeKey ? item[nodeKey] : index"
        class="m-waterfall-item absolute duration-300"
        :style="{
          width: columnWidth + 'px',
          top: item._style?.top + 'px',
          left: item._style?.left + 'px',
        }"
      >
        <slot :item="item" :index="index" :width="columnWidth" />
      </div>
    </template>
    <!-- 加载前显示 -->
    <!-- <div v-else>loading...</div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue'
import {
  getImgElements,
  getImageUrls,
  imgsPreload,
  getMinHeightColumn,
  getMinHeight,
  getMaxHeight,
} from './utils'
import {} from 'vue-router'
const props = defineProps({
  // 数据源
  data: {
    type: Array,
    required: true,
  },
  // 唯一标识的 key
  nodeKey: {
    type: String,
  },
  // 列数
  column: {
    default: 2,
    type: Number,
  },
  // 列间距
  columnSpacing: {
    default: 20,
    type: Number,
  },
  // 行间距
  rowSpacing: {
    default: 20,
    type: Number,
  },
  // 是否需要进行图片预读取
  picturePreReading: {
    type: Boolean,
    default: true,
  },
})

// 容器高度
const containerHeight = ref(0)
// 每列的高度 key: 所在列， value：每列的高度
const columnHeightObj = ref({})
/**
 * @description: 计算每列的高度
 */
const useColumnsHeight = () => {
  columnHeightObj.value = {}
  for (let i = 0; i < props.column; i++) {
    columnHeightObj.value[i] = 0
  }
}

/**
 * @description: 计算容器宽度 （宽度 - 内边距
 */
// 容器实例
const containerTarget = ref(null)
// 容器宽度
const containerWidth = ref(0)

// 容器左边距 ，用于计算 item left
const containerLeftPadding = ref(0)

const useContainerWidth = () => {
  // containerTarget： 获取cssStyle 对象
  let { paddingLeft, paddingRight } = getComputedStyle(containerTarget.value, null)
  containerLeftPadding.value = parseFloat(paddingLeft)
  // Element.clientWidth 元素宽度，包括内边距（padding），但不包括边框（border）、外边距（margin）和垂直滚动条（如果存在）
  // arseFloat() 函数解析一个参数（必要时先转换为字符串）并返回一个浮点数
  containerWidth.value =
    containerTarget.value.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight)
}

/**
 * @description: 计算列宽，列宽 = (容器宽度 - 间距 ) / 列数
 */
// 列间距 总宽度
const columnSpacingTotal = computed(() => {
  return props.columnSpacing * (props.column - 1)
})
// 每列的宽度
const columnWidth = ref(0)
const useColumnWidth = () => {
  // 获取容器宽度
  useContainerWidth()
  columnWidth.value = (containerWidth.value - columnSpacingTotal.value) / props.column

}

/**
 * @description: 组件挂载完毕，开始计算列宽
 */
onMounted(() => {
  useColumnWidth()
})

/**
 * @description: 计算 每个 item 的高度
 */
// 每个 item 的高度
let itemHeights = []
/**
 * @description: 图片预加载时, 监听图片加载完成，获取图片高度
 */
const uesItemHeightImgPreload = async () => {
  itemHeights = []
  // 获取所有 item 元素（类数组 需要 转换为数组
  let itemElements = [...document.getElementsByClassName('m-waterfall-item')]
  // 获取所有 img 元素
  const imgElements = getImgElements(itemElements)
  // 获取 所有 img 元素 的图片
  const imgUrls = getImageUrls(imgElements)
  // 监听 图片加载完成 onload事件（promise成功
  try {
    let res = await imgsPreload(imgUrls)
  } catch (error) {
    console.log(error)
  }
  // 获取 item高度
  itemElements.forEach((item) => {
    itemHeights.push(item.offsetHeight)
  })
  console.log(itemHeights)
  // 指定 item 渲染位置（top、left）
  useItemLocation()
}

/**
 * @description: 不需要图片预加载时，直接获取图片高度
 */
const uesItemHeight = () => {
  itemHeights = []
  // 获取所有 item 元素
  let itemElements = [...document.getElementsByClassName('m-waterfall-item')]

  // 获取 item高度
  itemElements.forEach((item) => {
    itemHeights.push(item.offsetHeight)
  })
  // 指定 item 渲染位置（top、left）
  useItemLocation()
}

/**
 * @description: 计算 item 渲染位置（top、left）
 * 1. 瀑布流渲染机制：item横向排列， item 会被渲染到 最小高度所在的列中
 * 给 数据源中的 每个 item对象添加 _style属性，用于保存 top、left
 * 2. left = 最小高度所在列 * （item宽度 + 间距）+ 容器左边距
 * 3. top = 最小高度列 的 高度 + 边距
 * 4. 给即将渲染 item 的列 增加高度 = 原高度 + 即将渲染item的高度 + 行间距
 * 5. 指定容器高度  = 最高列的高度（容器有 relative属性，脱离标准流，需要手动指定高度，因为容器高度后面要用到
 * 6. 在组件销毁时，清除所有 item的 _style属性
 */
const useItemLocation = () => {
  // 给每个 item数据源 添加一个 _style属性，用于保存 top、left
  props.data.forEach((item, index) => {
    // 已经有 _style属性的item，避免重复计算
    if (item._style) return
    item._style = {}
    // left
    item._style.left = getElementLeft()
    // top
    item._style.top = getElementTop()
    // 给即将渲染 item 的列 增加高度
    increasingHeight(index)
  })
  // 指定 容器高度 = 最高列的高度（容器有 relative属性，脱离标准流，必须手动指定高度
  containerHeight.value = getMaxHeight(columnHeightObj.value)
}

/**
 * @description: 接收 data 数据，视图更新后，进行计算
 * 1. 检查 data 中 是否已清除 _style属性
 * 2. 构建 columnHeightObj 容器
 * 3. 计算 item 高度 和 位置（top 、 left
 */
watch(
  () => props.data,
  (newValue) => {
    nextTick(() => {
      // 检查 data 中 是否已清除 _style属性
      const istDataReset = newValue.every((item) => !item._style)
      if (istDataReset) {
        // 构建 columnHeightObj
        useColumnsHeight()
      }
      if (props.picturePreReading) {
        // 需要 图片预加载
        uesItemHeightImgPreload()
      } else {
        // 不需要图片预加载
        uesItemHeight()
      }
    })
  },
  { deep: true }
)

/**
 * 监听列数变化，重新构建瀑布流
 */
const reset = () => {
  // 为什么要加定时器，不能直接使用 nextTick？ nextTick里还获取不到 容器的正确宽度（原因未知
  setTimeout(() => {
    // 重新计算列宽
    useColumnWidth()
    // 重置所有的定位数据，因为 data 中进行了深度监听，所以该操作会触发 data 的 watch
    props.data.forEach((item) => {
      item._style = null
    })
  }, 300)
}
watch(
  () => props.column,
  () => {
    if (props.picturePreReading) {
      // 在 picturePreReading 为 true 的前提下，需要首先为列宽滞空，重置item
      // 为什么要 重置item？
      // 确保重新 reset() 执行后，整个item会重新渲染(v-if="columnWidth")、img重新渲染；
      // 否则页面只会更新 数据发生变化的地方（列宽、item的top left），上次的图片还存在，所以监听图片加载时会立即执行resolve，此时获取到的 图片高度 还是上一次的数据，导致item高度计算不正确
      // 此时，真正的图片加载还没有完成，等到图片加载完成后，item 高度才正确
      columnWidth.value = 0
      // 等待页面渲染之后，重新执行计算。否则在 item 没有指定过高度的前提下，计算出的 item 高度会不正确
      nextTick(reset)
    } else {
      // 因为不需要重置视图，所以可以得到很漂亮的切换动画，并且将来 图片懒加载占位预览功能 ，也需要依次来进行实现才可以
      reset()
    }
  }
)

/**
 * @description: 在组件销毁时，清除所有 item的 _style属性
 */
onUnmounted(() => {
  props.data.forEach((item) => {
    delete item._style
  })
})

/**
 * @description: 计算 item的left
 */
const getElementLeft = () => {
  // 最小高度 所在的 列index
  const columnIdex = getMinHeightColumn(columnHeightObj.value)
  // left = 最小高度所在列 * （item宽度 + 边距）+ 容器左边距
  return columnIdex * (columnWidth.value + props.columnSpacing) + containerLeftPadding.value
}

/**
 * @description: 计算 item的top
 */
const getElementTop = () => {
  // 最小高度
  const minHeight = getMinHeight(columnHeightObj.value)
  // top = 最小高度列 的 高度 + 边距
  return minHeight + props.rowSpacing
}

/**
 * @description: 给即将渲染 item 的列 增加高度
 */
const increasingHeight = (index) => {
  // 最小高度 所在的 列index
  const columnIdex = getMinHeightColumn(columnHeightObj.value)
  // 即将渲染 item 的列高度 = 原高度 + 即将渲染item的高度 + 行间距
  columnHeightObj.value[columnIdex] += itemHeights[index] + props.rowSpacing
}
</script>

<style lang="scss" scoped></style>
