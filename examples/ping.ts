import assert = require('assert')
import Promise = require('bluebird')
import lib = require('../app')
import common = require('./common')

const jobsCount = 100

function generateJobPayload() {
	return 'abc'
}

function ping(maxJobs: number, maxQueued: number) : Promise<number> {
	const client = common.createClient({maxJobs, maxQueued}, (job) => {
		var payload = job.payload.toString()
		assert.equal(payload, 'abc')
		setTimeout(() => job.end(job.payload.toString().toUpperCase()), 20) 
	})
	console.log(arguments)
	let calcSpeed = (timeMs: number) => timeMs / jobsCount

	return common.run({ jobsCount, client, calcSpeed, generateJobPayload})
}

lib.optimize(5, ping, [100, 100], -100).done(console.log)
