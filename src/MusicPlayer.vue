<template>
  <div 
    class="music-player" 
    :class="{ 'expanded': isExpanded, 'left': position === 'left', 'right': position === 'right' }"
    :style="{ 
      top: '50%',
      transform: `translateY(-50%) translateX(${dragOffset}px)`
    }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="handleDragStart"
  >
    <!-- 封面区域 -->
    <div class="cover-section">
      <img 
        v-if="currentSong.cover" 
        :src="currentSong.cover" 
        :alt="currentSong.title"
        class="cover-image"
      />
      <div v-else class="cover-placeholder"></div>
    </div>

    <!-- 信息与控制区域 -->
    <div class="info-controls">
      <div class="song-info">
        <div class="song-title">{{ currentSong.title || '未知歌曲' }}</div>
        <div class="song-artist">{{ currentSong.artist || '未知艺术家' }}</div>
      </div>

      <!-- 控制按钮 -->
      <div class="controls">
        <button @click="prevSong" class="control-btn" :disabled="songs.length <= 1">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>
        
        <button @click="togglePlay" class="play-pause-btn control-btn">
          <svg v-if="isPlaying" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M8 5v14l11-7z"/>
          </svg>
        </button>
        
        <button @click="nextSong" class="control-btn" :disabled="songs.length <= 1">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>

      <!-- 进度条 -->
      <div class="progress-container">
        <input 
          type="range" 
          min="0" 
          :max="duration || 100"
          :value="currentTime"
          @input="handleProgressChange"
          class="progress-slider"
        />
        <div class="time-display">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>
      </div>

      <!-- 音量控制 -->
      <div class="volume-control">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
        <input 
          type="range" 
          min="0" 
          max="1"
          :value="volume"
          step="0.01"
          @input="handleVolumeChange"
          class="volume-slider"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 从环境变量中获取配置
const config = typeof MUSIC_PLAYER_OPTIONS !== 'undefined' ? MUSIC_PLAYER_OPTIONS : {
  songs: [],
  autoPlay: false,
  defaultVolume: 0.5,
  defaultIndex: 0
}

// 状态
const songs = ref(config.songs || [])
const autoPlay = ref(config.autoPlay || false)
const defaultVolume = ref(config.defaultVolume !== undefined ? config.defaultVolume : 0.5)
const defaultIndex = ref(config.defaultIndex !== undefined ? config.defaultIndex : 0)

const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(defaultVolume.value)
const currentIndex = ref(Math.min(defaultIndex.value, songs.value.length - 1))
const isExpanded = ref(false)
const position = ref('left') // left 或 right
const dragOffset = ref(0)

// 鼠标悬停相关
let hoverTimer = null

// 拖拽相关
let isDragging = false
let startX = 0
let startOffset = 0

// Audio 元素引用
let audioElement = null

// 计算属性
const currentSong = computed(() => {
  if (songs.value.length > 0 && currentIndex.value >= 0 && currentIndex.value < songs.value.length) {
    return songs.value[currentIndex.value]
  }
  return { title: '', artist: '', cover: '', url: '' }
})

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

// 鼠标事件处理
const handleMouseEnter = () => {
  clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => {
    isExpanded.value = true
  }, 300)
}

const handleMouseLeave = () => {
  clearTimeout(hoverTimer)
  isExpanded.value = false
}

// 拖拽事件处理
const handleDragStart = (e) => {
  if (e.target.classList.contains('progress-slider') || e.target.classList.contains('volume-slider')) {
    return
  }
  
  isDragging = true
  startX = e.clientX
  startOffset = dragOffset.value
  
  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
}

const handleDragMove = (e) => {
  if (!isDragging) return
  
  const deltaX = e.clientX - startX
  dragOffset.value = startOffset + deltaX
}

const handleDragEnd = () => {
  if (!isDragging) return
  
  isDragging = false
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
  
  // 自动吸附到最近的边界
  const windowWidth = window.innerWidth
  const playerWidth = 300 // 假设展开宽度为300px
  const centerPosition = windowWidth / 2
  const currentPosition = windowWidth / 2 + dragOffset.value
  
  if (currentPosition < centerPosition) {
    // 吸附到左侧
    dragOffset.value = -windowWidth / 2 + 25 // 25px是收缩状态的宽度
    position.value = 'left'
  } else {
    // 吸附到右侧
    dragOffset.value = windowWidth / 2 - 25
    position.value = 'right'
  }
}

// 播放控制
const togglePlay = () => {
  if (!audioElement) return
  
  if (isPlaying.value) {
    audioElement.pause()
  } else {
    audioElement.play().catch(err => {
      console.warn('播放失败:', err)
    })
  }
}

const prevSong = () => {
  if (songs.value.length <= 1) return
  
  currentIndex.value = (currentIndex.value - 1 + songs.value.length) % songs.value.length
  if (isPlaying.value) {
    playCurrentSong()
  }
}

const nextSong = () => {
  if (songs.value.length <= 1) return
  
  currentIndex.value = (currentIndex.value + 1) % songs.value.length
  if (isPlaying.value) {
    playCurrentSong()
  }
}

// 播放当前歌曲
const playCurrentSong = () => {
  if (!audioElement || !currentSong.value.url) return
  
  audioElement.src = currentSong.value.url
  audioElement.load()
  if (isPlaying.value) {
    audioElement.play().catch(err => {
      console.warn('播放失败:', err)
    })
  }
}

// 进度和音量控制
const handleProgressChange = (e) => {
  if (!audioElement) return
  
  const newTime = parseFloat(e.target.value)
  audioElement.currentTime = newTime
  currentTime.value = newTime
}

const handleVolumeChange = (e) => {
  if (!audioElement) return
  
  const newVolume = parseFloat(e.target.value)
  audioElement.volume = newVolume
  volume.value = newVolume
}

// Audio 事件处理
const handleLoadedMetadata = () => {
  if (audioElement) {
    duration.value = audioElement.duration || 0
  }
}

const handleTimeUpdate = () => {
  if (audioElement) {
    currentTime.value = audioElement.currentTime
  }
}

const handleEnded = () => {
  // 歌曲结束自动播放下一首
  nextSong()
}

const handleError = (e) => {
  console.error('音频播放出错:', e)
}

// 初始化 Audio 元素
const initAudio = () => {
  if (typeof window === 'undefined') return
  
  audioElement = new Audio()
  audioElement.volume = volume.value
  
  audioElement.addEventListener('loadedmetadata', handleLoadedMetadata)
  audioElement.addEventListener('timeupdate', handleTimeUpdate)
  audioElement.addEventListener('ended', handleEnded)
  audioElement.addEventListener('error', handleError)
  
  // 如果有歌曲且启用自动播放
  if (songs.value.length > 0 && autoPlay.value) {
    playCurrentSong()
    isPlaying.value = true
  }
}

// 清理事件监听
const cleanup = () => {
  if (audioElement) {
    audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
    audioElement.removeEventListener('timeupdate', handleTimeUpdate)
    audioElement.removeEventListener('ended', handleEnded)
    audioElement.removeEventListener('error', handleError)
    audioElement = null
  }
  
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
}

// 组件挂载和卸载
onMounted(() => {
  initAudio()
  
  // 初始化位置
  if (typeof window !== 'undefined') {
    dragOffset.value = -window.innerWidth / 2 + 25
    position.value = 'left'
  }
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.music-player {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 25px;
  height: 50px;
  /* 默认背景色，防止CSS变量未定义时不可见 */
  background: rgba(131, 208, 218, 0.314);
  background: var(--vp-c-brand-soft, rgba(131, 208, 218, 0.314));
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
  cursor: grab;
}

.music-player.expanded {
  width: 300px;
}

.music-player.left {
  left: 0;
}

.music-player.right {
  right: 0;
}

.music-player:active {
  cursor: grabbing;
}

.cover-section {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  /* 默认背景色 */
  background: #8cccd5;
  background: var(--vp-c-brand-3, #8cccd5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-placeholder::before {
  content: "♪";
  /* 默认颜色 */
  color: #5086a1;
  color: var(--vp-c-brand-1, #5086a1);
  font-size: 20px;
}

.info-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.music-player.expanded .info-controls {
  opacity: 1;
}

.song-info {
  margin-bottom: 8px;
}

.song-title {
  font-weight: bold;
  font-size: 14px;
  /* 默认颜色 */
  color: #5086a1;
  color: var(--vp-c-brand-1, #5086a1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 12px;
  /* 默认颜色 */
  color: #6aa1b7;
  color: var(--vp-c-brand-2, #6aa1b7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.control-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  /* 默认颜色 */
  color: #5086a1;
  color: var(--vp-c-brand-1, #5086a1);
}

.control-btn:hover:not(:disabled) {
  background: rgba(80, 134, 161, 0.1);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-pause-btn {
  width: 32px;
  height: 32px;
  /* 默认背景色 */
  background: #5086a1;
  background: var(--vp-c-brand-1, #5086a1);
  color: white;
}

.play-pause-btn:hover:not(:disabled) {
  /* 默认背景色 */
  background: #6aa1b7;
  background: var(--vp-c-brand-2, #6aa1b7);
}

.progress-container {
  margin-bottom: 8px;
}

.progress-slider {
  width: 100%;
  height: 4px;
  appearance: none;
  /* 默认背景色 */
  background: #8cccd5;
  background: var(--vp-c-brand-3, #8cccd5);
  border-radius: 2px;
  outline: none;
}

.progress-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  /* 默认背景色 */
  background: #5086a1;
  background: var(--vp-c-brand-1, #5086a1);
  cursor: pointer;
}

.time-display {
  font-size: 10px;
  /* 默认颜色 */
  color: #6aa1b7;
  color: var(--vp-c-brand-2, #6aa1b7);
  text-align: right;
  margin-top: 2px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider {
  flex: 1;
  height: 4px;
  appearance: none;
  /* 默认背景色 */
  background: #8cccd5;
  background: var(--vp-c-brand-3, #8cccd5);
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  /* 默认背景色 */
  background: #5086a1;
  background: var(--vp-c-brand-1, #5086a1);
  cursor: pointer;
}
</style>