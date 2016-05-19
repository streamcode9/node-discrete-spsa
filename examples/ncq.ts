import fs = require('fs')
import Promise = require('bluebird')
import lib = require('../app')
const ab = require('abraxas')

ab.Server.listen()

const tubeName = 'test_tube'
const jobsCount = 10

function readPageFromFile(pageSize: number) : Promise<Buffer> {	
	return new Promise<Buffer>(resolve => {
		fs.open('123.txt', 'r', (err, fd) => {
			fs.read(fd, new Buffer(pageSize), 0, pageSize, 0, (err, bytesRead, buffer) => {
				fs.close(fd, (err) => resolve(buffer))
			})
		})
	})
}

function pushJobs(jobsCount: number, client: any, tube: string) {
	let jobs: any[] = []
	for (let i = 0; i < jobsCount; i++) jobs.push(client.submitJob(tube, 'abc'))
	return Promise.all(jobs)
}

function createClient(tube: string, maxJobs: number, maxQueued: number, pageSize: number) {
	const client = ab.Client.connect({ maxJobs: maxJobs, maxQueued: maxQueued })
	client.registerWorker(tube, (job: any) => {
		readPageFromFile(pageSize).then(data => job.end(data))
	})
	return client
}

function ping(tube: string, maxJobs: number, maxQueued: number, pageSize: number) : Promise<number> {
	const client = createClient(tube, maxJobs, maxQueued, pageSize)

	return new Promise<number>(resolve => {
		pushJobs(jobsCount, client, tube).then(() => {
			const start = Date.now()
			pushJobs(jobsCount, client, tube).then(() => {
				client.forgetAllWorkers()
				client.disconnect()
				const speed = (Date.now() - start) / jobsCount
				resolve(speed)
			})
		})
	})
}

const run = (i: number = 1, theta: number[] = [100, 100, 100]) => {
	lib.iteration(x => ping(tubeName, theta[0], theta[1], theta[2]), theta, 100)
		.then(t => {
			let thetaNext = lib.projectMinMax([10, 10, 10], lib.round(t), [1000, 1000, 1000])
			console.log(thetaNext)
			if (i < 25) run(i + 1, thetaNext)
			else console.log('DONE!!! maxJobs =', thetaNext[0], 'maxQueued=', thetaNext[1], 'pageSize=', thetaNext[2])
		})
}
run()