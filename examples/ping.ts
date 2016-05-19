import assert = require('assert')
import Promise = require('bluebird')
import lib = require('../app')
import common = require('./common')
const ab = require('abraxas')

ab.Server.listen()

const tube = 'test_tube'
const jobsCount = 100

function generateJobsPayload() {
	return 'abc'
}

function ping(maxJobs: number, maxQueued: number) : Promise<number> {
	const client = common.createClient(tube, maxJobs, maxQueued, (job) => {
		var payload = job.payload.toString()
		assert.equal(payload, 'abc')
		setTimeout(() => job.end(job.payload.toString().toUpperCase()), 20) 
	})

	return new Promise<number>(resolve => {
		common.pushJobs(tube, jobsCount, client, generateJobsPayload).then(() => {
			const start = Date.now()
			common.pushJobs(tube, jobsCount, client, generateJobsPayload).then(() => {
				client.forgetAllWorkers()
				client.disconnect()
				const speed = (Date.now() - start) / jobsCount
				resolve(speed)
			})
		})
	})
}

lib.optimize(5, ping, [100, 100], 100)