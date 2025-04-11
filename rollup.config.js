import { readFileSync } from 'node:fs';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));

const production = !process.env.ROLLUP_WATCH;

const createPlugins = (isNpmBuild = false) => [
  resolve({
    browser: true,
    ...(isNpmBuild && {
      dedupe: ['preact', 'preact/compat', 'react', 'react-dom'],
    }),
  }),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
  }),
  postcss({
    modules: true,
    extract: false,
    minimize: production,
    sourceMap: !production,
  }),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(
      production ? 'production' : 'development',
    ),
  }),
  ...(isNpmBuild
    ? [
        alias({
          entries: [
            { find: 'react', replacement: 'preact/compat' },
            { find: 'react-dom', replacement: 'preact/compat' },
          ],
        }),
      ]
    : []),
  production && terser(),
];

export default [
  {
    input: 'src/standalone/chatbox.ts',
    output: [
      {
        file: 'dist/chatbox.min.js',
        format: 'iife',
        name: 'FleekChatbox',
        sourcemap: !production,
      },
    ],
    plugins: createPlugins(false),
  },
  {
    input: 'src/npm/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: !production,
    },
    external: ['react', 'react-dom'],
    plugins: createPlugins(true),
  },
  {
    input: 'src/npm/index.ts',
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: !production,
    },
    external: ['react', 'react-dom'],
    plugins: createPlugins(true),
  },
];
