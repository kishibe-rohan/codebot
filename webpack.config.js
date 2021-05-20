const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
	entry: path.resolve(__dirname, 'index.ts'),
	externals: [nodeExternals()],
	target: 'node',
	resolve: {
		extensions: ['.ts']
	},
	output: {
		path: path.resolve(__dirname, './build'),
		filename: './index.js'
	},
	node: {
		__dirname: true
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			}
		]
	}
}
