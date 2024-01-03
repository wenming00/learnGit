import { fileURLToPath, URL } from 'node:url'
import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import inject from '@rollup/plugin-inject'
import type { ConfigEnv, UserConfig } from 'vite'

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  return {
    server: {
      host: true,
      port: 8080,
      open: true,
      proxy: {
        '/v1': {
          target: 'https://mock.apifox.com/m1/3563194-0-default',
          changeOrigin: true,
        },
      },
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_debugger: mode === 'production',
          drop_console: mode === 'production',
        },
      },
      sourcemap: mode !== 'production',
      reportCompressedSize: false,
    },
    plugins: [
      vue(),
      vueJsx(),
      inject({
        baseConfig: path.resolve(__dirname, `src/config/${mode}`),
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname,'src')
      }
    }
  }
})
