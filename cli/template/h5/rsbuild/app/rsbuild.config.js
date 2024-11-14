import path from 'node:path'
import UIResolve from '@hl/h5/resolver'
import { defineConfig, loadEnv } from '@rsbuild/core'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginImageCompress } from '@rsbuild/plugin-image-compress'
import { pluginSass } from '@rsbuild/plugin-sass'
import { pluginVue } from '@rsbuild/plugin-vue'
import { pluginVueJsx } from '@rsbuild/plugin-vue-jsx'
import { VantResolver } from '@vant/auto-import-resolver'
import AutoImport from 'unplugin-auto-import/rspack'
import Components from 'unplugin-vue-components/rspack'
import useAlias from './alias.config'

const { publicVars } = loadEnv({ prefixes: ['VITE_'] })
const { alias_map } = useAlias()

export default defineConfig({
  html: {
    template: './public/index.html',
    title: publicVars['import.meta.env.VITE_WEB_NAME'].replaceAll(/"/g, ''),
  },
  server: {
    base: '/',
  },
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
    }),
    pluginVue(),
    pluginVueJsx(),
    pluginSass({
      sassLoaderOptions: {
        implementation: require.resolve('sass'),
      },
    }),
    pluginImageCompress(),
  ],
  tools: {
    rspack: {
      plugins: [
        AutoImport({
          imports: ['vue', 'pinia', 'vue-router', '@vueuse/core'],
          eslintrc: {
            enabled: true,
          },
          dirs: [
            './src/pinia/modules',
          ],
          dts: true,
        }),
        Components({
          directoryAsNamespace: true,
          resolvers: [
            VantResolver(),
            UIResolve(),
          ],
          dts: true,
        }),
      ],
    },
  },
  source: {
    alias: alias_map,
    define: publicVars,
    include: [
      path.resolve(__dirname, '../../packages/ui'),
      /[\\/]node_modules[\\/]/,
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
})
