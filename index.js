const { watch, rollup } = require('rollup')
const configs = require('./rollup.config')

const liveserver = require('live-server')

Promise.all(configs.map(async config => {
	const build = await rollup(config)
	await build.write(config.output)
	const w = watch(config)
	process.on('beforeExit', () => w.close())
})).then(() => {
	console.log('build complete')
	const lv = liveserver.start({
		port: 3000, // Set the server port. Defaults to 8080.
		host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
		root: './public', // Set root directory that's being served. Defaults to cwd.
		open: false, // When false, it won't load your browser by default.
		ignore: 'src', // comma-separated string for paths to ignore
		file: './index.html', // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
		wait: 4000, // Waits for all changes, before reloading. Defaults to 0 sec.
		mount: [
			['/', './dist'],
			['/', './public'],
		], // Mount a directory to a route.
		logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
		// middleware: [function (req, res, next) { next() }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
	})
	console.log('live server started')
})

// liveserver.start({
// 	port: 3000, // Set the server port. Defaults to 8080.
// 	// host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
// 	root: './', // Set root directory that's being served. Defaults to cwd.
// 	// open: false, // When false, it won't load your browser by default.
// 	ignore: 'src', // comma-separated string for paths to ignore
// 	file: './public/index.html', // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
// 	wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
// 	mount: [
// 		['/', './dist'],
// 		['/', './public'],
// 	], // Mount a directory to a route.
// 	logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
// 	// middleware: [function (req, res, next) { next() }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
// })
