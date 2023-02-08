/**
 * @description: 处理时间格式
 */
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import duration from 'dayjs/plugin/duration'

// 国际化（默认英文
dayjs.locale('zh')
// 安装duration插件
dayjs.extend(duration)

export default dayjs
