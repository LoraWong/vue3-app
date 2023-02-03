// search
import { defineStore } from 'pinia'
import store from '@/store'
import { setItem, getItem } from '@/utils/storage'
import { SEARCH_HISTORY } from '@/constants'

export const useSearchStore = defineStore({
  id: 'search',
  state: () => ({
    // 搜索历史
    historyList: getItem(SEARCH_HISTORY) || [],
  }),
  getters: {},
  actions: {
    // 新增 搜索历史 （1. 新增的搜索历史位于头部；2. 搜索历史不可重复
    addHistory(newHistory) {
      // 找出 重复元素的索引
      const repeatIndex = this.historyList.indexOf(newHistory)
      // 判断 是否重复, 如果重复，删除重复元素
      if (repeatIndex !== -1) {
        // 删除重复
        this.historyList.splice(repeatIndex, 1)
      }
      // 新增（追加到前面
      this.historyList.unshift(newHistory)
      // 保存到本地
      setItem(SEARCH_HISTORY, this.historyList)
    },
    // 删除 单个 搜索历史
    deleteHistory(index) {
      this.historyList.splice(index, 1)
      // 保存到本地
      setItem(SEARCH_HISTORY, this.historyList)
    },
    // 删除全部 搜索历史
    deleteAllHistory() {
      this.historyList = []
      // 保存到本地
      setItem(SEARCH_HISTORY, this.historyList)
    },
  },
})

// 在组件外使用 store
// useStore()中 自动注入了 pinia 实例。这意味着，如果 pinia 实例不能自动注入，必须手动提供给 useStore() 函数
export function useSearchWithOutSetup() {
  return useSearchStore(store)
}
