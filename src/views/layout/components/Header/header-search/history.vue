<template>
  <div class="">
    <div class="flex items-center text-xs mb-1 text-zinc-400">
      <span>最近搜索</span>
      <m-svg-icon
        name="delete"
        class="w-2.5 h-2.5 ml-1 p-0.5 cursor-pointer duration-300 rounded-sm hover:bg-zinc-100"
        fillClass="fill-zinc-400"
        @click="onDeleteAllClick"
      ></m-svg-icon>
    </div>

    <div class="flex flex-wrap">
      <div
        v-for="(item, index) in searchStore.historyList"
        :key="item"
        class="mr-2 mb-1.5 flex items-center cursor-pointer bg-zinc-100 px-1.5 py-0.5 text-zinc-900 text-sm font-bold rounded-sm duration-300 hover:bg-zinc-200"
        @click="onItemClick(item)"
      >
        <span>{{ item }}</span>
        <m-svg-icon
          name="input-delete"
          class="w-2.5 h-2.5 p-0.5 ml-1 duration-300 rounded-sm hover:bg-zinc-100"
          @click.stop="onDeleteClick(index)"
        ></m-svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
const EMIT_ITEM_CLICK = 'onItemClick'
</script>
<script setup>
import {} from 'vue'
import { useSearchStore } from '@/store/modules/search.js'
import { confirm } from '@/libs'

const searchStore = useSearchStore()
const emits = defineEmits([EMIT_ITEM_CLICK])

/**
 * @description: 点击 history
 */
const onItemClick = (item) => {
  // 触发 父组件 搜索回调
  emits(EMIT_ITEM_CLICK, item)
}

/**
 * @description: 删除 指定 history
 */
const onDeleteClick = (index) => {
  searchStore.deleteHistory(index)
}

/**
 * @description: 删除所有 item
 */
const onDeleteAllClick = () => {
  // 弹出确认框
  confirm('Are you sure you want to delete?')
    .then(() => {
      // 确认回调
      console.log('yes, delete')
      // 删除所有 item
      searchStore.deleteAllHistory()
    })
    .catch(() => {
      // 取消回调
      console.log('cancel delete')
    })
}
</script>

<style lang="scss" scoped></style>
