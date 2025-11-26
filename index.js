import MusicPlayer from './MusicPlayer.vue'

export default (options = {}) => {
  return (app) => {
    // 注册全局组件
    app.component('MusicPlayer', MusicPlayer)
    
    // 在客户端增强时添加音乐播放器到页面
    if (typeof window !== 'undefined') {
      // 等待VuePress完成初始渲染
      setTimeout(() => {
        try {
          // 将插件配置存储在全局变量中，供组件访问
          window.__MUSIC_PLAYER_OPTIONS__ = {
            songs: options.songs || [],
            autoPlay: options.autoPlay || false,
            defaultVolume: options.defaultVolume !== undefined ? options.defaultVolume : 0.5,
            defaultIndex: options.defaultIndex !== undefined ? options.defaultIndex : 0
          }
          
          // 创建挂载点
          const mountPoint = document.createElement('div')
          mountPoint.id = 'music-player-mount-point'
          document.body.appendChild(mountPoint)
          
          // 创建Vue应用实例
          const { createApp } = require('vue')
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
export { MusicPlayer }