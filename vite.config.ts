import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

const buildTarget = process.env.BUILD_TARGET || 'esm';

export default defineConfig(() => {
  switch (buildTarget) {
    case 'umd':
      return {
        build: {
          outDir: 'dist',
          emptyOutDir: false,
          lib: {
            entry: resolve(__dirname, 'index.ts'),
            name: 'exprEval',
            formats: ['umd' as const],
            fileName: () => 'bundle.js'
          },
          rollupOptions: {
            output: {
              exports: 'named' as const
            }
          },
          minify: false
        }
      };

    case 'umd-min':
      return {
        build: {
          outDir: 'dist',
          emptyOutDir: false,
          lib: {
            entry: resolve(__dirname, 'index.ts'),
            name: 'exprEval',
            formats: ['umd' as const],
            fileName: () => 'bundle.min.js'
          },
          rollupOptions: {
            output: {
              exports: 'named' as const
            }
          },
          minify: 'terser' as const,
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true
            }
          }
        }
      };

    case 'esm':
    default:
      return {
        plugins: [
          dts({
            tsconfigPath: './tsconfig.build.json',
            insertTypesEntry: true
          })
        ],
        build: {
          outDir: 'dist',
          emptyOutDir: buildTarget === 'esm', // Only clean on first build
          lib: {
            entry: resolve(__dirname, 'index.ts'),
            name: 'exprEval',
            formats: ['es' as const],
            fileName: () => 'index.mjs'
          },
          rollupOptions: {
            output: {
              exports: 'named' as const
            }
          },
          minify: false
        }
      };
  }
});
