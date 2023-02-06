// app
import { defineStore } from 'pinia'
import store from '@/store'
import { ALL_CATEGORY_ITEM } from '@/constants'
import { useCategoryStore } from './category'
import { isMobileTerminal } from '@/utils/flexible'

export const useAppStore = defineStore({
  id: 'app',
  state: () => ({
    // 当前选中的分类（默认 全部
    currentCategory: ALL_CATEGORY_ITEM,
    // 搜索关键字
    searchText: '',
    // 路由过渡类型：push|back|none（pc端不需要过渡动画
    routerType: 'none',
    // 虚拟任务栈（路由缓存列表,先入后出
    virtualTaskStack: [],
  }),
  getters: {
    // 当前 选中分类的索引值
    currentCategoryIndex(state) {
      const categoryStore = useCategoryStore()
      // findIndex()方法 返回数组中满足提供的测试函数的第一个元素的索引
      return categoryStore.category.findIndex((item) => item.id === state.currentCategory.id)
    },
    // 路由过渡类型：push|back|none（pc端不需要过渡动画
    currentRouterType(state) {
      if (!isMobileTerminal.value) return 'none'
      return state.routerType
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
    // 修改路由过渡类型
    changeRouterType(newRouterType) {
      this.routerType = newRouterType
      // 判断 路由组件是否已经缓存
      // const isFind = this.virtualTaskStack.includes(task)
      // if (!isFind) {
      //   this.routerType = 'push'
      // } else {
      //   this.routerType = 'back'
      // }
      console.log('🚀 ~ file: app.js:42 ~ changeRouterType ~ newRouterType', this.routerType)
    },
    // 添加 路由缓存组件
    addVirtualTask(task) {
      this.virtualTaskStack.push(task)
    },
    // 删除 路由缓存组件
    removeVirtualTask(task) {
      const index = this.virtualTaskStack.indexOf(task)
      if (index > -1) {
        this.virtualTaskStack.splice(index, 1)
      }
    },
    // 清空路由缓存组件(只留下根路由组件)
    clearVirtualTaskStack(rootTask) {
      this.virtualTaskStack = [rootTask]
    },
  },
})
// 在组件外使用 store
// useStore()中 自动注入了 pinia 实例。这意味着，如果 pinia 实例不能自动注入，必须手动提供给 useStore() 函数
export function useAppWithOutSetup() {
  return useAppStore(store)
}
