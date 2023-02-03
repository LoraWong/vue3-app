// app
import { defineStore } from 'pinia'
import store from '@/store'
import { ALL_CATEGORY_ITEM } from '@/constants'
import { useCategoryStore } from './category'

export const useAppStore = defineStore({
  id: 'app',
  state: () => ({
    // 当前选中的分类（默认 全部
    currentCategory: ALL_CATEGORY_ITEM,
    // 搜索关键字
    searchText: '',
  }),
  getters: {
    // 当前 选中分类的索引值
    currentCategoryIndex(state) {
      const categoryStore = useCategoryStore()
      // findIndex()方法 返回数组中满足提供的测试函数的第一个元素的索引
      return categoryStore.category.findIndex((item) => item.id === state.currentCategory.id)
    },
  },
  actions: {
    // 切换 分类
    changeCurrentCategory(newCategory) {
      this.currentCategory = newCategory
    },
    // 修改 searchText
    changeSearchText(newSearchText) {
      this.searchText = newSearchText
    },
  },
})
// 在组件外使用 store
// useStore()中 自动注入了 pinia 实例。这意味着，如果 pinia 实例不能自动注入，必须手动提供给 useStore() 函数
export function useAppWithOutSetup() {
  return useAppStore(store)
}
