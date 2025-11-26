// 示例配置文件，展示如何在 VuePress 项目中使用音乐播放器插件

import { defineUserConfig } from 'vuepress'
import musicPlayer from './src/index.js'

export default defineUserConfig({
  base: '/',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'VuePress 音乐插件示例',
      description: 'VuePress 音乐播放挂件插件使用示例'
    }
  },
  
  plugins: [
    musicPlayer({
      // 歌曲列表（必需）
      songs: [
        {
          title: '示例歌曲1',
          artist: '艺术家1',
          cover: 'https://example.com/cover1.jpg',
          url: 'https://example.com/song1.mp3'
        },
        {
          title: '示例歌曲2',
          artist: '艺术家2',
          cover: 'https://example.com/cover2.jpg',
          url: 'https://example.com/song2.mp3'
        },
        {
          title: '示例歌曲3',
          artist: '艺术家3',
          cover: 'https://example.com/cover3.jpg',
          url: 'https://example.com/song3.mp3'
        }
      ],
      
      // 是否自动播放（可选，默认：false）
      autoPlay: false,
      
      // 默认音量（可选，默认：0.5）
      defaultVolume: 0.7,
      
      // 默认播放歌曲索引（可选，默认：0）
      defaultIndex: 0
    })
  ]
})