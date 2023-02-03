import { watch } from 'vue'
import { useThemeStoreWithOutSetup } from '@/store/modules/theme.js'
import { THEME_LIGHT, THEME_SYSTEM, THEME_DARK } from '@/constants'

const themeStore = useThemeStoreWithOutSetup()

/**
 * @description: 主题跟随系统 ，监听系统主题变更
 */
let matchMedia
const watchSystemThemeChange = () => {
  // 仅需初始化一次即可
  if (matchMedia) return
  // window.matchMedia('(prefers-color-scheme: dark)') 方法, 该方法可以返回一个 MediaQueryList 对象
/*    该对象存在一个 change 事件，可以监听 主题发生变更 的行为。
      同时存在一个 matches 属性，该属性为 boolean 性的值：
      true：深色主题
      false：浅色主题 */
  matchMedia = window.matchMedia('(prefers-color-scheme: dark)')
  // 监听主题变更
  matchMedia.onchange = function () {
    changeTheme(THEME_SYSTEM)
  }
}

/**
 * @description: 主题变更
 */
const changeTheme = (theme) => {
  // html class
  let themeClassName = ''
  switch (theme) {
    case THEME_LIGHT:
      themeClassName = 'light'
      break

    case THEME_DARK:
      themeClassName = 'dark'
      break

    case THEME_SYSTEM:
      // 监听系统主题变化
      watchSystemThemeChange()
      // true: 深色模式； false: 浅色模式
      themeClassName = matchMedia.matches ? 'dark' : 'light'
      break
  }
  // 修改 html class的值
  document.querySelector('html').className = themeClassName
}

/**
 * @description: 初始化主题
 */
export const useTheme = () => {
  // 主题改变 或 初始化项目时，进行 html 的class配置
  // 监听 主题变化
  watch(
    () => themeStore.themeType,
    (val) => {
      if (val) {
        changeTheme(val)
      }
    },
    {
      immediate: true,
    }
  )
}
