import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts';

const plugins = [
  dts({
    include: ['src/**/*'],
    beforeWriteFile: (filePath, content) => {
      console.log("path Name+++++", {filePath,content})
      return {
        filePath: filePath.replace('src/', 'dist/'),
        content
      }
    }
  }),
  react()
]

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@udit/react-turbo2',
      fileName: (format) => `index.${format}.js`
    } ,
    rollupOptions: {
      external: ['react, react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  plugins,
})
