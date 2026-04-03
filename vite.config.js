/*
  配置文件
  告诉 Vite 这是一个 Vue 项目，需要使用 Vue 插件来处理 .vue 文件。
*/

import { defineConfig } from 'vite'  // 导入 defineConfig 函数，用于定义 Vite 配置对象
import vue from '@vitejs/plugin-vue'  // 导入 vue 插件
import { resolve } from 'path'  // 导入 path 模块，用于处理文件路径

export default defineConfig({

  // 插件配置
  plugins: [
    // 使用 Vue 插件
    vue(),
  ],
  
  // 路径别名配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),  // 设置 @ 指向 src 目录
      '@assets': resolve(__dirname, 'src/assets'),  // 设置 @assets 指向 src/assets 目录
      '@components': resolve(__dirname, 'src/components'),  // 设置 @components 指向 src/components 目录
      '@views': resolve(__dirname, 'src/views'),  // 设置 @views 指向 src/views 目录
      '@utils': resolve(__dirname, 'src/utils'),  // 设置 @utils 指向 src/utils 目录
      '@api': resolve(__dirname, 'src/api'),  // 设置 @api 指向 src/api 目录
      '@hooks': resolve(__dirname, 'src/hooks'),  // 设置 @hooks 指向 src/hooks 目录
      '@stores': resolve(__dirname, 'src/stores'),  // 设置 @stores 指向 src/stores 目录
      '@constants': resolve(__dirname, 'src/constants'),  // 设置 @constants 指向 src/constants 目录
      '@types': resolve(__dirname, 'src/types'),  // 设置 @types 指向 src/types 目录
    }
  },
  
  // 服务器配置
  server: {
    port: 3000,  // 设置开发服务器端口为 3000
    strictPort: true,  // 严格使用指定端口，如果端口被占用则报错
    open: true,  // 启动时自动打开浏览器
    proxy: {
      // 配置代理，将/api请求转发到后端服务器
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // 构建配置
  build: {
    outDir: 'dist',  // 输出目录
    assetsDir: 'assets',  // 静态资源目录
    sourcemap: false,  // 不生成 source map
    minify: 'terser',  // 使用 terser 压缩
    terserOptions: {
      compress: {
        drop_console: true,  // 生产环境移除 console
        drop_debugger: true,  // 生产环境移除 debugger
      },
    },
  },
})
