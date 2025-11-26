// VuePress 插件入口文件
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default (options = {}, ctx) => {
  return {
    name: 'vuepress-plume-music-widget',
    
    // 定义要传递给客户端的配置
    define: {
      MUSIC_PLAYER_OPTIONS: {
        songs: options.songs || [],
        autoPlay: options.autoPlay || false,
        defaultVolume: options.defaultVolume !== undefined ? options.defaultVolume : 0.5,
        defaultIndex: options.defaultIndex !== undefined ? options.defaultIndex : 0
      }
    },
    
    // 定义客户端增强文件
    enhanceAppFiles: resolve(__dirname, 'client.js'),
    
    // 定义全局 UI 组件
    globalUIComponents: 'MusicPlayer'
  }
}