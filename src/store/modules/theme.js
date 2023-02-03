import { defineStore } from 'pinia'
import { CURRENT_THEME, THEME_LIGHT, THEME_SYSTEM, THEME_DARK } from '@/constants'
import store from '@/store'
import { setItem, getItem } from '@/utils/storage'

export const useThemeStore = defineStore({
  id: 'theme',
  state: () => ({
    // 主题模式
    themeType: getItem(CURRENT_THEME) || THEME_LIGHT,
  }),
  getters: {},
  actions: {
    // 切换主题模式
    changeTheme(newTheme) {
      this.themeType = newTheme
      setItem(CURRENT_THEME, newTheme)
    },
  },
})

export function useThemeStoreWithOutSetup() {
  return useThemeStore(store)
}
