import rollupConfig from './rollup.config';
import terser from '@rollup/plugin-terser';

const config = { ...rollupConfig };
config.output = { ...rollupConfig.output };
config.plugins = [...rollupConfig.plugins, terser()];
config.output.file = 'dist/bundle.min.js';

export default config;
