/**
 * @description: localStorage
 */
export const setItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

/**
 * @description: localStorage
 */
export const getItem = (key) => {
  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}

/**
 * @description: localStorage
 */
export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}

/**
 * @description: localStorage
 */
export const clear = () => {
  window.localStorage.clear()
}
