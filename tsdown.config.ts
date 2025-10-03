import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/cli.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  platform: 'node',
  target: 'node20',
  splitting: false,
  treeshake: true,
})
