# VuePress 音乐播放挂件插件使用示例

## 安装插件

```bash
npm install vuepress-plume-music-widget
```

## 在 VuePress 配置中使用插件

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
          title: '夜曲',
          artist: '周杰伦',
          cover: '/images/yinqu.jpg',
          url: '/music/yinqu.mp3'
        },
        {
          title: '青花瓷',
          artist: '周杰伦',
          cover: '/images/qinghuaci.jpg',
          url: '/music/qinghuaci.mp3'
        },
        {
          title: '稻香',
          artist: '周杰伦',
          cover: '/images/daoxiang.jpg',
          url: '/music/daoxiang.mp3'
        }
      ],
      
      // 是否自动播放（可选，默认：false）
      autoPlay: true,
      
      // 默认音量（可选，默认：0.5）
      defaultVolume: 0.7,
      
      // 默认播放歌曲索引（可选，默认：0）
      defaultIndex: 0
    })
  ]
})
```

## 配置说明

### songs（必需）
歌曲信息数组，每个元素包含以下属性：
- `title`: 歌曲标题
- `artist`: 艺术家
- `cover`: 封面图片路径
- `url`: 音频文件路径

### autoPlay（可选）
是否在页面加载后自动播放音乐，默认为 `false`。

### defaultVolume（可选）
默认音量，范围为 0-1，默认为 `0.5`。

### defaultIndex（可选）
默认播放的歌曲索引，默认为 `0`（第一首歌曲）。

## 注意事项

1. 插件会自动在页面上创建一个音乐播放器挂件，无需在 Markdown 文件中手动引入
2. 挂件默认吸附在页面左侧或右侧边缘，鼠标悬停时会展开完整界面
3. 用户可以通过拖拽移动挂件位置，释放后会自动吸附到最近的边缘
4. 所有配置项都会在插件初始化时一次性传入，之后无法动态更改