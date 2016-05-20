import assert = require('assert')
import Promise = require('bluebird')
import lib = require('../app')
const ab = require('abraxas')

ab.Server.listen()

const tube = 'test_tube'

export function run(opts: any) {
	assert(opts.jobsCount > 0)

	const client = ab.Client.connect({ maxJobs: opts.maxJobs, maxQueued: opts.maxQueued, defaultEncoding: 'utf8' })
	client.registerWorker(tube, (job: any) => {
		opts.onJob(job.payload).done((result: Buffer | string) => job.end(result))
	})

	const pushJobs = () => {
		const jobs: Promise<any>[] = []
		for (let i = 0; i < opts.jobsCount; i++) {
			jobs.push(client.submitJob(tube, opts.emitJob()))
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
