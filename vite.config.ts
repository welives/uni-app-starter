import { URL, fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import uni from '@dcloudio/vite-plugin-uni'
import { viteMockServe } from 'vite-plugin-mock'
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss/vite'
import { isPackageExists } from 'local-pkg'
import { WeappTailwindcssDisabled } from './platform'
import { plugins as postcssPlugins } from './postcss.config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const PORT = Number.parseInt(env.VITE_APP_PORT)
  return {
    server: {
      port: isNaN(PORT) ? undefined : PORT,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      uni(),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: ['vue', 'uni-app', 'pinia'],
        eslintrc: {
          enabled: true,
        },
        dts: true,
      }),
      uvwt({ disabled: WeappTailwindcssDisabled }),
      viteMockServe(),
      axiosAdapterPlugin(),
    ],
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

function axiosAdapterPlugin() {
  const hasFormDataPolyfill = isPackageExists('miniprogram-formdata')
  const hasBlobPolyfill = isPackageExists('miniprogram-blob')
  return {
    name: 'vite-plugin-uni-axios',
    transform(code, id) {
      if (process.env.UNI_PLATFORM?.includes('mp')) {
        if (id.includes('/form-data/lib/browser.js')) {
          return {
            code: code.replace('window', 'globalThis'),
          }
        }
        if (id.includes('/axios/lib/platform/browser/classes/FormData.js')) {
          return {
            code: `${hasFormDataPolyfill ? 'import FormData from \'miniprogram-formdata\';' : 'class FormData {};'
              }export default FormData;`,
          }
        }
        if (id.includes('/axios/lib/platform/browser/classes/Blob.js')) {
          return {
            code: `${hasBlobPolyfill ? 'import Blob from \'miniprogram-blob\';' : 'class Blob {};'}export default Blob;`
          }
        }
      }
    },
  }
}
