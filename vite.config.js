import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/FindYourDream/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        polaris: resolve(__dirname, 'polaris.html'),
        bigbang: resolve(__dirname, 'bigbang.html'),
        about: resolve(__dirname, 'about.html'),
        board: resolve(__dirname, 'board.html'),
        photo_editor: resolve(__dirname, 'photo-editor.html'),
        horoscope: resolve(__dirname, 'horoscope.html')
      }
    }
  }
})
