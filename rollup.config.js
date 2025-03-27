import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/chatbox.ts',
  output: {
    file: 'dist/chatbox.js',
    format: 'iife',
    name: 'Chatbox',
  },
  plugins: [typescript()]
};