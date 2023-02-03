<template>
  <m-search v-model="inputValue" @search="onSearchHandler" @blur="onSearchHandler">
    <template #dropdown>
      <div>
        <!-- 搜索提示 -->
        <hint-vue
          :searchText="inputValue"
          v-show="inputValue"
          @onItemClick="onSearchHandler"
        ></hint-vue>
        <!-- 搜索历史 -->
        <history-vue v-show="!inputValue" @onItemClick="onSearchHandler"></history-vue>
        <!-- 推荐 -->
        <theme-vue v-show="!inputValue" @onItemClick="onSearchHandler"></theme-vue>
      </div>
    </template>
  </m-search>
</template>
<script>
export default {
  name: 'HeaderSearch',
}
</script>
<script setup>
import { ref } from 'vue'
import hintVue from './hint.vue'
import historyVue from './history.vue'
import themeVue from './theme.vue'
import { useAppStore } from '@/store/modules/app.js'
import { useSearchStore } from '@/store/modules/search.js'

const inputValue = ref('')
const appStore = useAppStore()
const searchStore = useSearchStore()

/**
 * @description: 搜索事件回调
 * 触发 搜索回调 的地方：
 * 1. 点击搜索提示
 * 2. 点击搜索按钮
 * 3. 点击搜索历史
 * 4. input框 失去焦点
 * 搜索回调要做的事：
 * 修改 inputValue(input框中显示的值)
 * 保存 搜索关键字 到 搜索历史中
 * 保存 搜索关键字 到 searchText （list组件中监视 searchText变化，携带参数发请求获取数据进行展示
 */
const onSearchHandler = (val) => {
  if (val.trim() === '') return
  inputValue.value = val
  // 新增 history
  searchStore.addHistory(val)
  // 保存 搜索关键字 到 searchText
  appStore.changeSearchText(val)
}
</script>

<style lang="scss" scoped></style>
