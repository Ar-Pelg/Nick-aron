import path from 'path';
import { defineConfig } from 'vite'; // 'loadEnv' weggehaald bij import
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // De regel met 'const env = ...' is weg
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      
      // Het hele 'define' blok is hier verwijderd
      
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
