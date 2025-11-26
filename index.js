// VuePress 插件入口文件

/**
 * VuePress 2.x 音乐播放器插件
 */
export default (options, context) => ({
  define() {
    return {
      name: "vuepress-plume-music-widget",

      // 定义要传递给客户端的配置
      define: {
        MUSIC_PLAYER_OPTIONS: {
          songs: options.songs || [],
          autoPlay: options.autoPlay || false,
          defaultVolume:
            options.defaultVolume !== undefined ? options.defaultVolume : 0.5,
          defaultIndex:
            options.defaultIndex !== undefined ? options.defaultIndex : 0,
        },
      },
      enhanceAppFiles: "./client.js",
      globalUIComponents: "MusicPlayer",
    };
  },
});
