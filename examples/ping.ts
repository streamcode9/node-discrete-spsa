import Promise = require('bluebird')
import lib = require('../app')
const ab = require('abraxas')

ab.Server.listen()

const tubeName = 'test_tube'
const jobsCount = 100

function pushJobs(jobsCount: number, client: any, tube: string) {
	let jobs: any[] = []
	for (let i = 0; i < jobsCount; i++) jobs.push(client.submitJob(tube, 'abc'))
	return Promise.all(jobs)
}

function createClient(maxJobs: number, maxQueued: number, tube: string) {
	const client = ab.Client.connect({ maxJobs: maxJobs, maxQueued: maxQueued, defaultEncoding: 'utf8' })
	client.registerWorker(tube, (job: any) => {
		setTimeout(() => job.end(job.payload.toUpperCase()), 20)
	})
	return client
}

function ping(maxJobs: number, maxQueued: number, tube: string) : Promise<number> {
	const client = createClient(maxJobs, maxQueued, tube)

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

const run = (i: number = 1, theta: number[] = [100, 100]) => {
	lib.iteration(x => ping(theta[0], theta[1], tubeName), theta, 100)
		.then(t => {
			let thetaNext = lib.projectMinMax([10, 10], lib.round(t), [1000, 1000])
			if (i < 25) run(i + 1, thetaNext)
			else console.log('DONE!!! maxJobs =', thetaNext[0], 'maxQueued=', thetaNext[1])
		})
}
run()