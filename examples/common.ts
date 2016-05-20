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

export function run(opts: any) {
	assert(opts.jobsCount > 0)
	const pushJobs = () => {
		const jobs: Promise<any>[] = []
		for (let i = 0; i < opts.jobsCount; i++) {
			jobs.push(opts.client.submitJob(tube, opts.generateJobPayload()))
		}
		return Promise.all(jobs)
	}

	return pushJobs().then(() => {
		const start = Date.now()
		return pushJobs().then(() => {
			opts.client.forgetAllWorkers()
			opts.client.disconnect()
			return opts.calcSpeed(Date.now() - start)
		})
	})
}
