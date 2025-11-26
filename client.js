import { defineClientConfig } from '@vuepress/client'
import { h } from 'vue'
import MusicWidget from './src/MusicWidget.vue'

export default defineClientConfig({
  rootComponents: [
    () => h(MusicWidget)
  ]
})

