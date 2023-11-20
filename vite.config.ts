import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { viteMockServe } from 'vite-plugin-mock'
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss/vite'
import { WeappTailwindcssDisabled } from './platform'
import { plugins as postcssPlugins } from './postcss.config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const PORT = parseInt(env.VITE_APP_PORT)
  return {
    server: {
      port: isNaN(PORT) ? undefined : PORT,
    },
    plugins: [uni(), uvwt({ disabled: WeappTailwindcssDisabled }), viteMockServe()],
    // 内联 postcss 注册 tailwindcss
    css: {
      postcss: {
        plugins: postcssPlugins,
      },
    },
    define: {
      UNI_PLATFORM: JSON.stringify(process.env.UNI_PLATFORM),
    },
  }
})
