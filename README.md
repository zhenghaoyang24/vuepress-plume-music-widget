# VuePress 音乐播放挂件插件

## 项目概述

本项目是一个基于 VuePress 官方规范开发的音乐播放器挂件插件，采用 JavaScript Setup 语法编写。插件包含 `.vue` 组件文件和入口文件，为 VuePress 站点提供优雅的背景音乐播放功能。

## 功能特性

- 全局单实例组件，直接渲染在页面 body 下，无需在 Markdown 中手动引入
- 支持音乐播放/暂停控制
- 支持上一首/下一首切换
- 实时显示歌曲封面、歌曲名称和艺术家信息
- 可拖拽的进度条控制
- 可调节的音量控制条

## 界面布局

- 组件高度固定为 50px
- 左侧区域：歌曲封面、歌曲名称、艺术家信息
- 右侧区域：播放进度条、上一首/下一首按钮、播放/暂停按钮、音量调节条
- 默认吸附在窗口左侧或右侧边缘（距离边界为 0）
- 初始状态仅显示封面区域，鼠标悬停时展开完整功能面板
- 支持拖拽移动，释放后自动吸附到距离最近的左/右边界

## 安装

```bash
npm install vuepress-plume-music-widget
```

## 使用方法

### 1. 在 VuePress 配置中注册插件

```javascript
// .vuepress/config.js
import { defineUserConfig } from 'vuepress'
import musicPlayer from 'vuepress-plume-music-widget'

export default defineUserConfig({
  // ... 其他配置
  
  plugins: [
    musicPlayer({
      // 歌曲列表（必需）
      songs: [
        {
          title: '歌曲名称1',
          artist: '艺术家1',
          cover: '/path/to/cover1.jpg',
          url: '/path/to/song1.mp3'
        },
        {
          title: '歌曲名称2',
          artist: '艺术家2',
          cover: '/path/to/cover2.jpg',
          url: '/path/to/song2.mp3'
        }
      ],
      
      // 是否自动播放（可选，默认：false）
      autoPlay: false,
      
      // 默认音量（可选，默认：0.5）
      defaultVolume: 0.5,
      
      // 默认播放歌曲索引（可选，默认：0）
      defaultIndex: 0
    })
  ]
})
```

### 2. 配置选项说明

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| songs | Array | 是 | [] | 歌曲信息列表 |
| autoPlay | Boolean | 否 | false | 是否自动播放 |
| defaultVolume | Number | 否 | 0.5 | 默认音量（0-1） |
| defaultIndex | Number | 否 | 0 | 默认播放歌曲索引 |

### 3. 歌曲信息数据结构

```javascript
{
  title: '歌曲名称',
  artist: '艺术家',
  cover: '封面图片URL',
  url: '音频文件URL'
}
```

## 样式设计

背景采用高斯模糊效果，配色方案如下：

```css
--vp-c-brand-1: #5086a1;           /* 链接颜色、强调色 */
--vp-c-brand-2: #6aa1b7;           /* 链接、按钮 hover 颜色 */
--vp-c-brand-3: #8cccd5;           /* 背景色、边框色 */
--vp-c-brand-soft: rgba(131, 208, 218, 0.314); /* 辅助色 */
```

## 开发指南

### 项目结构

```
src/
├── MusicPlayer.vue  # 音乐播放器组件
└── index.js         # 插件入口文件
```

### 组件功能

1. 音乐播放控制：
   - 播放/暂停功能
   - 上一首/下一首切换
   - 进度条拖拽控制
   - 音量调节控制

2. 信息展示：
   - 歌曲封面显示
   - 歌曲名称展示
   - 艺术家信息展示

3. 用户界面交互：
   - 组件高度固定为 50px
   - 默认吸附在窗口左侧或右侧边缘
   - 初始状态仅显示封面区域
   - 鼠标悬停时展开完整功能面板
   - 支持拖拽移动并自动吸附到最近边界

## 注意事项

- 除歌曲信息外，其他配置项均有合理的默认值
- 当指定索引的歌曲不存在时自动播放第一首
- 若未传入任何歌曲信息，则不播放音乐
- 插件使用 CSS 变量定义品牌色，可根据需要自定义主题

## 许可证

MIT