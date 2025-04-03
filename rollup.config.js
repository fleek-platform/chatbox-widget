import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve'; // Resolves node modules
import commonjs from '@rollup/plugin-commonjs'; // Converts CommonJS modules to ES6
import replace from '@rollup/plugin-replace'; // Replaces strings in files, used for env variables
import postcss from 'rollup-plugin-postcss'; // Handles CSS imports and CSS Modules
import terser from '@rollup/plugin-terser'; // Minifies the bundle
import alias from '@rollup/plugin-alias'; // For aliasing modules
import { readFileSync } from 'node:fs';

// Get package version for versioned builds
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const version = pkg.version;

// Determine if this is a production build (you might set this via environment variable)
const production = !process.env.ROLLUP_WATCH;

// Shared plugins for all builds
const createPlugins = (isNpmBuild = false) => [
  resolve({
    browser: true,
    // For npm builds, we want to externalize react and react-dom
    ...(isNpmBuild && {
      dedupe: ['preact', 'preact/compat', 'react', 'react-dom'],
    }),
  }),
  commonjs(), // Convert CommonJS modules
  typescript({
    tsconfig: './tsconfig.json',
    // Ensure TS plugin handles JSX correctly based on tsconfig
  }),
  postcss({
    modules: true, // Enable CSS Modules
    extract: false, // Inject styles into <head>
    minimize: production, // Minimize CSS in production
    sourceMap: !production,
  }),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(
      production ? 'production' : 'development'
    ),
  }),
  // For npm builds, alias react to preact/compat
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
  // Minify in production
  production && terser(),
];

export default [
  // Standalone build (IIFE)
  {
    input: 'src/standalone/chatbox.ts',
    output: [
      {
        file: 'dist/chatbox.js',
        format: 'iife',
        name: 'FleekChatbox',
        sourcemap: !production,
      },
      {
        file: `dist/chatbox-${version}.js`,
        format: 'iife',
        name: 'FleekChatbox',
        sourcemap: !production,
      },
    ],
    plugins: createPlugins(false),
  },
  // NPM library build (ESM)
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
  // NPM library build (CJS)
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
