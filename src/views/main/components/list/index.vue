<template>
  <m-infinite-list v-model="loading" :isFinished="isFinished" @onLoad="getPixelsListData">
    <waterfall-vue
      class="px-1"
      :data="pixelsList"
      nodeKey="id"
      :column="isMobileTerminal ? 2 : 5"
      :picturePreReading="false"
    >
      <template v-slot="{ item, width }">
        <item-vue :data="item" :width="width" @click="onToDetailClick" />
      </template>
    </waterfall-vue>
  </m-infinite-list>
  <!-- detail -->
  <!--  :css="false" 显式地向 Vue 表明可以跳过对 CSS 过渡的自动探测。除了性能稍好一些之外，还可以防止 CSS 规则意外地干扰过渡效果。 -->
  <transition :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
    <detail-vue v-if="isVisibleDetail" :id="currentItem.id"></detail-vue>
  </transition>
</template>
<script>
export default {
  name: 'ListVue',
}
</script>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getPixelsList } from '@/api/pixels.js'
import ItemVue from './item.vue'
import WaterfallVue from '@/libs/waterfall/index.vue'
import { isMobileTerminal } from '@/utils/flexible.js'
import { useAppStore } from '@/store/modules/app.js'
import detailVue from '@/views/detail/components/detail.vue'
import gsap from 'gsap'

const appStore = useAppStore()
// 数据是否在 加载中
const loading = ref(false)
// 数据 是否 全部加载完成
const isFinished = ref(false)

let query = {
  page: 1,
  size: 20,
}
// 数据源
const pixelsList = ref([])

/**
 * @description: 重置参数
 */
const resetQuery = (newQuery) => {
  // 相同属性，后面会覆盖前面
  query = { ...query, ...newQuery }
  console.log('🚀 ~ file: index.vue:51 ~ resetQuery ~ query', query)
  // 重置加载状态
  isFinished.value = false
  // 清空数据源，目标元素出现在viewport，就会 触发 onLoad事件回调（重新发请求
  pixelsList.value = []
}

/**
 * @description: 获取数据
 */
const getPixelsListData = async () => {
  // 数据 是否 全部加载完成
  if (isFinished.value) return
  // 完成 第一次请求后，以后的请求参数 page自增
  if (pixelsList.value.length > 0) {
    query.page += 1
  }

  const res = await getPixelsList(query)

  // 如果是 第一页
  if (query.page === 1) {
    pixelsList.value = res.list
  } else {
    // 请求的数据 追加到 数据组中
    pixelsList.value.push(...res.list)
  }

  // 判断 数据是否全部加载完成
  if (pixelsList.value.length === res.total) {
    // 显示 数据已经全部加载完成
    isFinished.value = true
  }
  // 修改 loading 为 false
  loading.value = false
}

/**
 * @description: 监听currentCategory变化，重新发请求获取对应Category数据
 */
watch(
  () => appStore.currentCategory,
  (currentCategory) => {
    // 重置参数
    resetQuery({
      page: 1,
      categoryId: currentCategory.id,
    })
    // 发起请求
  }
)

/**
 * @description: 监听 searchText变化，重新发请求获取对应Category数据
 */
watch(
  () => appStore.searchText,
  (val) => {
    // 重置参数
    resetQuery({
      page: 1,
      searchText: val,
    })
  }
)

/**
 * @description: 点击 Item，跳转到对应的detail
 */

//  控制 detail 显示与隐藏
const isVisibleDetail = ref(false)
const currentItem = ref({})

const onToDetailClick = (item) => {
  // 修改浏览器的url
  // history.pushState() 方法向当前浏览器会话的历史堆栈中添加一个状态
  // history.pushState(state, title[, url]); 浏览器不会在调用 pushState() 之后尝试加载此 URL
  history.pushState(null, null, `/detail/${item.id}`)
  // 保存 当前Item
  currentItem.value = item

  // 显示 detail组件
  isVisibleDetail.value = true
}

/**
 * @description: detail组件过渡动画(使用 第三方库 gsap)
 * 执行对应 transition 钩子
 * gsap.set() ：这个方法通常使用在动画开始之前，表示设置动画开始前的元素属性
 * gsap.to()：这个方法表示 最终元素展示的状态
 */
const onBeforeEnter = (el) => {
  gsap.set(el, {
    scaleX: 0,
    scaleY: 0,
    // transform-origin CSS 属性让你更改一个元素变形的原点
    transformOrigin: '0 0',
    translateX: currentItem.value.location?.translateX,
    translateY: currentItem.value.location?.translateY,
    opacity: 0,
  })
}

const onEnter = (el, done) => {
  gsap.to(el, {
    duration: 0.3,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    translateX: 0,
    translateY: 0,
    // 动画完成时的回调
    onComplete: done,
  })
}

const onLeave = (el, done) => {
  gsap.to(el, {
    duration: 0.3,
    scaleX: 0,
    scaleY: 0,
    x: currentItem.value.location?.translateX,
    y: currentItem.value.location?.translateY,
    opacity: 0,
  })
}

/**
 * @description: 监听浏览器后退按钮事件,隐藏 detail
 */
onMounted(() => {
  window.addEventListener('popstate', () => {
    isVisibleDetail.value = false
  })
})
</script>

<style lang="scss" scoped></style>
