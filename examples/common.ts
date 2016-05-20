import assert = require('assert')
import Promise = require('bluebird')
import lib = require('../app')
const ab = require('abraxas')

ab.Server.listen()

const tube = 'test_tube'

export interface Job {
	payload: string
	end(stringResult?: Buffer | string) : void
}

export interface AbraxasParameters {
	maxJobs: number
	maxQueued: number
	jobsCount: number
	calcSpeed: (timeMs: number) => number
	emitJob: () => Buffer | string
	onJob: (payload: Buffer | string ) => Promise<Buffer | string>
}

export function run(opts: AbraxasParameters) {
	assert(opts.jobsCount > 0)

	const client = ab.Client.connect({ maxJobs: opts.maxJobs, maxQueued: opts.maxQueued, defaultEncoding: 'utf8' })
	client.registerWorker(tube, (job: Job) => {
		opts.onJob(job.payload).done((result: Buffer | string) => job.end(result))
	})

	const pushJobs = () => Promise.all(lib.pushN(
			opts.jobsCount
		,	() => client.submitJob(tube, opts.emitJob()))
	)

	return pushJobs().then(() => {
		const start = Date.now()
		return pushJobs().then(() => {
			client.forgetAllWorkers()
			client.disconnect()
			return opts.calcSpeed(Date.now() - start)
		})
	})
}
