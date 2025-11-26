// client.js - 客户端增强文件
// VuePress 2.x 客户端增强文件的格式
import { defineAsyncComponent, h, createApp } from 'vue'
import MusicPlayer from './src/MusicPlayer.vue'

// 客户端增强函数
// export default ({ app, router, siteData }) => {
//   // 注册全局组件
//   app.component('MusicPlayer', MusicPlayer)
  
//   // 等待DOM加载完成后创建并挂载音乐播放器
//   if (typeof window !== 'undefined') {
//     window.addEventListener('DOMContentLoaded', () => {
//       // 创建挂载点
//       const mountPoint = document.createElement('div')
//       mountPoint.id = 'music-player-container'
//       document.body.appendChild(mountPoint)
      
//       // 创建独立的Vue应用实例来挂载音乐播放器
//       const playerApp = createApp(MusicPlayer)
//       playerApp.mount(mountPoint)
//     })
//   }
// }
export default ({ Vue }) => {
  Vue.component('MusicPlayer', MusicPlayer)
}

