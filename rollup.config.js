const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const typescript = require('rollup-plugin-typescript')
const replace = require('rollup-plugin-replace')

module.exports = [
	{
		input: 'src/client.tsx',
		output: {
			file: 'dist/client.js',
			format: 'iife',
			name: '_' + Math.random().toString()
		},
		plugins: [
			typescript({
				typescript: require('typescript'),
			}),
			commonjs({
				extensions: ['.mjs', '.js', '.jsx', '.json', '.node', '.ts', '.tsx',]
			}),
			resolve({
				extensions: ['.mjs', '.js', '.jsx', '.json', '.node', '.ts', '.tsx',]
			}),
			replace({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
			}),
		],
	}
]
