// 客户端增强文件
import MusicPlayer from './src/MusicPlayer.vue'

export default ({ Vue }) => {
  // 注册全局组件
  Vue.component('MusicPlayer', MusicPlayer)
}