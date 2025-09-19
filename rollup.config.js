import typescript from '@rollup/plugin-typescript';

export default {
  input: 'index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'exprEval',
    exports: 'named'
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.build.json'
    })
  ]
};
