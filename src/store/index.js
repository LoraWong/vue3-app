import { createPinia } from 'pinia'

const store = createPinia()
export const installStore = (app) => {
  app.use(store)
}

export default store
