import assert = require('assert')
import Promise = require('bluebird')
import lib = require('../app')
import common = require('./common')

function ping(maxJobs: number, maxQueued: number) : Promise<number> {
	return common.run(
		{ maxJobs
		, maxQueued
		, jobsCount : 100
		, calcSpeed :
			function (timeMs: number) {
				const speed = this.jobsCount / timeMs
				console.log({maxJobs, maxQueued, speed: speed.toPrecision(2)})
				return speed
			}
		, emitJob :
			() => 'abc'
		, onJob :
			(payload: string) => {
				assert.equal(payload, 'abc')
				return Promise.delay(20).then(() => payload.toUpperCase())
			}
		})
}

lib.optimize(5, ping, [100, 100], -100).done(console.log)
