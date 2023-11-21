import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App).use(createPinia().use(piniaPluginPersistedstate))
  return {
    app,
  }
}
