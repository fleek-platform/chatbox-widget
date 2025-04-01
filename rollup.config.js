import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve'; // Resolves node modules
import commonjs from '@rollup/plugin-commonjs'; // Converts CommonJS modules to ES6
import replace from '@rollup/plugin-replace'; // Replaces strings in files, used for env variables
import postcss from 'rollup-plugin-postcss'; // Handles CSS imports and CSS Modules
import terser from '@rollup/plugin-terser'; // Minifies the bundle

// Determine if this is a production build (you might set this via environment variable)
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/chatbox.ts', // Entry point remains the same for now
  output: {
    file: 'dist/chatbox.js',
    format: 'iife', // Immediately Invoked Function Expression suitable for <script> tag
    name: 'FleekChatbox', // Global variable name if needed
    sourcemap: !production, // Generate sourcemaps for development
  },
  plugins: [
    resolve({ browser: true }), // Resolve modules for browser environment
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
        production ? 'production' : 'development',
      ),
    }),
    // Minify in production
    production && terser(),
  ],
};
