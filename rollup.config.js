import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';

const packageJson = require('./package.json');

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        name: 'fraop-mvi-dev-tools'
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser()
    ],
    external: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'd3',
      'recharts',
      'rxjs'
    ]
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/]
  }
]; 