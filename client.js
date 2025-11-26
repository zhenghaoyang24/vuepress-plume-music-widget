// client.js - 客户端增强文件
// 这个文件只在浏览器环境中运行，所以可以安全地导入 .vue 文件

import MusicPlayer from './src/MusicPlayer.vue'

export default ({ app }) => {
  // 注册全局组件
  app.component('MusicPlayer', MusicPlayer)
}