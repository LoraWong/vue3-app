import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { installStore } from './store'
import { initRem } from './utils/flexible'
import { useTheme } from '@/utils/theme'
import mLibs from './libs'
import directives from './directives'
import './permission'
import './style/index.scss'
// 注册 vite-plugin-svg-icons
import 'virtual:svg-icons-register'

const app = createApp(App)
installStore(app)
app.use(router).use(mLibs).use(directives).mount('#app')

initRem()
useTheme()
