import assert = require('assert')
import Promise = require('bluebird')
import lib = require('../app')
const ab = require('abraxas')

ab.Server.listen()

const tube = 'test_tube'

export function createClient(opts: { maxJobs: number, maxQueued: number}, onJobDone: (job: any) => void) {
	const client = ab.Client.connect(opts)
	client.registerWorker(tube, onJobDone)
	return client
}

export function pushJobs(jobsCount: number, client: any, generateJobPayload: () => any) {
	assert(jobsCount > 0)	
	const jobs: Promise<any>[] = []
	for (let i = 0; i < jobsCount; i++) jobs.push(client.submitJob(tube, generateJobPayload()))
	return Promise.all(jobs)
}

export function run(opts: any) {
	let run = () => pushJobs(opts.jobsCount, opts.client, opts.generateJobPayload)

	return run().then(() => {
		const start = Date.now()
		return run().then(() => {
			opts.client.forgetAllWorkers()
			opts.client.disconnect()
			return opts.calcSpeed(Date.now() - start)
		})
	})
}
