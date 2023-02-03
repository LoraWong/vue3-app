/**
 * @description: 生成随机色值
 */

export const randomColor = () => {
  const colorList = ['#ff9999', '#b36b6b', '#b3b36b', '#99b3ff', '#ffc299']
  const randomIndex = Math.floor(Math.random() * colorList.length)
  return colorList[randomIndex]
}
