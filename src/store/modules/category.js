// navigation
import { defineStore } from 'pinia'
import { ALL_CATEGORY_ITEM, CATEGORIES } from '@/constants'
import { getCategory } from '@/api/category'
import store from '@/store'
import { setItem, getItem } from '@/utils/storage'

export const useCategoryStore = defineStore({
  id: 'category',
  state: () => ({
    // navigation 数据源
    /* 让 $store.getters.categorys 具备一个初始数据(从本地存储中读取)：
      1.当获取到服务端数据时，替换初始数据
      2.同时【缓存 localStorage】该次服务端数据，作为下次的初始数据
      3.之后每次进入都执行该三步操作 */
    category: getItem(CATEGORIES) || [],
  }),
  getters: {},
  actions: {
    async setCategory() {
      // 发请求，获取 category 数据
      const { categorys } = await getCategory()      
      this.category = [ALL_CATEGORY_ITEM, ...categorys]
      setItem(CATEGORIES, this.category)
    },
  },
})

// 在组件外使用 store
// useStore()中 自动注入了 pinia 实例。这意味着，如果 pinia 实例不能自动注入，必须手动提供给 useStore() 函数
export function useCategoryWithOutSetup() {
  return useCategoryStore(store)
}
