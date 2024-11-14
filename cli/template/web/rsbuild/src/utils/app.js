// 运行环境：只区分开发环境还是生产环境 dev - 开发环境  prod - 生成环境
export const ENV_MODE = ['development', 'development.outer'].includes(import.meta.env.MODE) ? 'dev' : 'prod'

// 运行环境
export const MODE = import.meta.env.MODE

// 应用名称
export const WEB_NAME = import.meta.env.VITE_WEB_NAME

// 系统缓存统一前缀
export const PROJECT_PREFIX = import.meta.env.VITE_PROJECT_PREFIX

// 接口基本地址
export const BASE_URL = import.meta.env.VITE_BASE_URL

// 是否跨域
export const CORS = import.meta.env.VITE_CORS

// 图标服务地址
export const ICONIFY_API = import.meta.env.VITE_ICONIFY_API
