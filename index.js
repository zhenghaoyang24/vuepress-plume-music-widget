export default (options = {}) => {
  return async (app) => {
    // 在客户端增强时添加音乐播放器到页面
    if (typeof window !== 'undefined') {
      // 等待VuePress完成初始渲染
      setTimeout(async () => {
        try {
          // 将插件配置存储在全局变量中，供组件访问
          window.__MUSIC_PLAYER_OPTIONS__ = {
            songs: options.songs || [],
            autoPlay: options.autoPlay || false,
            defaultVolume: options.defaultVolume !== undefined ? options.defaultVolume : 0.5,
            defaultIndex: options.defaultIndex !== undefined ? options.defaultIndex : 0
          }
          
          // 动态导入组件
          const { default: MusicPlayer } = await import('./src/MusicPlayer.vue')
          
          // 注册全局组件
          app.component('MusicPlayer', MusicPlayer)
          
          // 创建挂载点
          const mountPoint = document.createElement('div')
          mountPoint.id = 'music-player-mount-point'
          document.body.appendChild(mountPoint)
          
          // 创建Vue应用实例
          const { createApp } = await import('vue')
          const playerApp = createApp(MusicPlayer)
          
          // 挂载组件
          playerApp.mount(mountPoint)
        } catch (error) {
          console.error('音乐播放器挂载失败:', error)
        }
      }, 100)
    }
  }
}

// 导出组件以供直接使用
export { default as MusicPlayer } from './src/MusicPlayer.vue'

// VuePress 插件入口文件
const { resolve } = require('path')

module.exports = (options = {}, ctx) => {
  return {
    name: 'vuepress-plume-music-widget',
    
    // 定义客户端增强文件
    enhanceAppFiles: resolve(__dirname, 'enhanceAppFile.js'),
    
    // 定义全局 UI 组件
    globalUIComponents: 'MusicPlayer',
    
    // 定义要传递给客户端的配置
    define: {
      MUSIC_PLAYER_OPTIONS: {
        songs: options.songs || [],
        autoPlay: options.autoPlay || false,
        defaultVolume: options.defaultVolume !== undefined ? options.defaultVolume : 0.5,
        defaultIndex: options.defaultIndex !== undefined ? options.defaultIndex : 0
      }
    }
  }
}
