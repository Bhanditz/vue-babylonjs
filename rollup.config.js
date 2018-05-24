import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import { fileSync as find } from 'find';

const plugins = [resolve(), babel({
  plugins: ['external-helpers'],
})];
const globals = {
  oimo: 'OIMO',
  cannon: 'CANNON',
  earcut: 'EARCUT',
};
const FILES = find(/.*\/.+\/.+\.js$/, './src').reduce((out, file) => ({
  ...out,
  [file.replace(/src\//, '').replace(/\.js$/, '')]: file,
}), {});

export default [{
  input: 'src/index.js',
  output: {
    format: 'es',
    file: 'dist/esm.js',
  },
  plugins,
}, {
  input: 'src/full.js',
  output: {
    format: 'umd',
    name: 'VueBabylonjs',
    file: 'dist/umd.js',
  },
  plugins: [...plugins, uglify],
}, {
  input: {
    index: 'src/core.js',
    ...FILES,
  },
  experimentalCodeSplitting: true,
  output: {
    format: 'cjs',
    dir: './lib',
  },
  plugins,
}];