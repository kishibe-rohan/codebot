const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
	entry: path.resolve(__dirname, 'index.ts'),
	externals: [nodeExternals()], //want them to be bundled for separate usage
	devtool: 'source-map',
	target: 'node',
	resolve: {
		extensions: ['.ts', '.js']
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
				test: /\.pem$/i,
				loader: 'raw-loader',
				exclude: /node_modules/
			},
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				// options: {
				// 	// configFile: path.resolve(websocketPath, 'config/webpack.tsconfig.json')
				// },
				exclude: /node_modules/
			}
		]
	}
}
