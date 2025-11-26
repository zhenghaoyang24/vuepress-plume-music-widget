// index.js - VuePress 2.x 音乐播放器插件

/**
 * VuePress 2.x 音乐播放器插件
 */
import { getDirname, path } from '@vuepress/utils'

const __dirname = getDirname(import.meta.url)
export default (options = {}) => {
  return {
    name: "vuepress-plume-music-widget",

    // 定义要传递给客户端的配置
    define: {
      MUSIC_PLAYER_OPTIONS: {
        songs: options.songs || [],
        autoPlay: options.autoPlay || false,
        defaultVolume: options.defaultVolume !== undefined ? options.defaultVolume : 0.5,
        defaultIndex: options.defaultIndex !== undefined ? options.defaultIndex : 0,
      }
    },

    clientConfigFile: path.resolve(__dirname, './client.js'),
  }
}