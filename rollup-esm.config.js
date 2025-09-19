import rollupConfig from './rollup.config';

const config = { ...rollupConfig };
config.output = { ...rollupConfig.output };
config.output.file = 'dist/index.mjs';
config.output.format = 'esm';

export default config;
