import path from 'node:path'
import { defineConfig, loadEnv } from '@rsbuild/core'
import { pluginImageCompress } from '@rsbuild/plugin-image-compress'
import { pluginSass } from '@rsbuild/plugin-sass'
import { pluginVue } from '@rsbuild/plugin-vue'
import AutoImport from 'unplugin-auto-import/rspack'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/rspack'
import useAlias from './alias.config'

const { alias_map } = useAlias()
const { publicVars } = loadEnv({ prefixes: ['VITE_'] })

export default defineConfig({
  html: {
    template: './public/index.html',
    title: publicVars['import.meta.env.VITE_WEB_NAME'].replace(/"/g, ''),
  },
  plugins: [
    pluginVue(),
    pluginSass(),
    pluginImageCompress(),
  ],
  tools: {
    rspack: {
      plugins: [
        Components({
          dts: true,
          directoryAsNamespace: true,
          resolvers: [
            ElementPlusResolver({
              importStyle: 'sass',
            }),
            {
              type: 'component',
              resolve: (name) => {
                if (name.startsWith('Hl')) {
                  return {
                    name,
                    importName: name,
                    from: '@hl/ui',
                    path: `@hl/ui/index.js`,
                  }
                }
              },
            },
          ],
        }),
        AutoImport({
          resolvers: [ElementPlusResolver()],
          imports: ['vue', 'pinia', 'vue-router', '@vueuse/core'],
          eslintrc: {
            enabled: true,
          },
          dirs: ['./src/pinia/modules'],
          dts: true,
        }),
      ],
    },
  },
  source: {
    alias: alias_map,
    define: publicVars,
    include: [
      path.resolve(__dirname, '../packages/task/src'),
      /[\\/]node_modules[\\/]/,
    ],
    exclude: [
      /node_modules[\\/]element-plus[\\/]/,
    ],
  },
  output: {
    polyfill: 'entry',
    legalComments: 'none',
    sourceMap: {
      js: false,
    },
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-module',
      override: {
        chunks: 'all',
        minSize: 8 * 1000 * 5,
      },
    },
  },
  dev: {},
})
