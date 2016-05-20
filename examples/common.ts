import assert = require('assert')
import Promise = require('bluebird')
import lib = require('../app')
const ab = require('abraxas')

ab.Server.listen()

const tube = 'test_tube'

export function run(opts: any) {
	assert(opts.jobsCount > 0)

	const client = ab.Client.connect({ maxJobs: opts.maxJobs, maxQueued: opts.maxQueued })
	client.registerWorker(tube, opts.onJob)

	const pushJobs = () => {
		const jobs: Promise<any>[] = []
		for (let i = 0; i < opts.jobsCount; i++) {
			jobs.push(client.submitJob(tube, opts.generateJobPayload()))
		}
		return Promise.all(jobs)
	}

	return pushJobs().then(() => {
		const start = Date.now()
		return pushJobs().then(() => {
			client.forgetAllWorkers()
			client.disconnect()
			return opts.calcSpeed(Date.now() - start)
		})
	})
}
