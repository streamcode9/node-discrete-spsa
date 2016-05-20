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
		}
	)
}

let iters = {
	min            : [   2,    2 ]
	, initialGuess : [ 100,  100 ]
	, max          : [1000, 1000 ]
	, iterations   : 5
	, learningRate : -100
	, fn : ping
	}

lib.optimize(iters.iterations, iters.fn, iters.initialGuess, iters.learningRate, (current) => lib.projectMinMax(iters.min, lib.round(current), iters.max)).done(console.log)
