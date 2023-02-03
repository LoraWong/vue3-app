import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path, { join } from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// const srcPath = join(__dirname, '/src')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // sgv 配置
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 指定 symbolId 格式
      symbolId: 'icon-[name]',
    }),
  ],
  // 软路径
  resolve: {
    alias: {
      '@': join(__dirname, '/src'),
    },
  },
  // 代理
  server: {
    proxy: {
      '/api': {
        // 代理请求之后的请求地址
        target: 'https://api.imooc-front.lgdsunday.club/',
        // 跨域
        changeOrigin: true,
      }
    },
  },
})
