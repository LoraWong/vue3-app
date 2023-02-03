// 使用插件批量注册全部指令

export default {
  install(app) {
    // https://cn.vitejs.dev/guide/features.html#glob-import
    // import.meta.globEager 为同步导入; import.meta.glob为异步导入（指令不需要异步导入
    // **Object.entries()**方法返回一个给定对象自身可枚举属性的键值对数组
    const directives = import.meta.globEager('./modules/*.js')
    for (const [key, value] of Object.entries(directives)) {
      // 拼接 name
      const arr = key.split('/')
      const directiveName = arr[arr.length - 1].replace('.js', '')
      // 注册
      // value.default 为 模块默认导出部分
      app.directive(directiveName, value.default)
    }
  },
}
