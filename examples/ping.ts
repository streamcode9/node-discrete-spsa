import assert = require('assert')
import Promise = require('bluebird')
import lib = require('../app')
import common = require('./common')

const jobsCount = 100

function generateJobPayload() {
	return 'abc'
}

function ping(maxJobs: number, maxQueued: number) : Promise<number> {
	const onJob = (payload: string) => {
		assert.equal(payload, 'abc')
		return Promise.delay(20).then(() => payload.toUpperCase())
	}
	console.log(arguments)
	let calcSpeed = (timeMs: number) => timeMs / jobsCount

	return common.run({ onJob, maxJobs, maxQueued, jobsCount, calcSpeed, generateJobPayload })
}

lib.optimize(5, ping, [100, 100], -100).done(console.log)
