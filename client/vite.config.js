import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({

  // we have created a proxy sever which is indicating that if you ecountered with /api anywhere in the routess
  // go to the localhost 3000 
  server:{
    proxy:{
      '/api':{
        target:'http://localhost:3000',
        secure: false,
      },
    },
  },

  plugins: [react()],
})
