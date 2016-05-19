import assert = require('assert')
import Promise = require('bluebird')
import lib = require('../app')
const ab = require('abraxas')

export function createClient(tube: string, maxJobs: number, maxQueued: number, onJobDone: (job: any) => void) {
	const client = ab.Client.connect({ maxJobs: maxJobs, maxQueued: maxQueued })
	client.registerWorker(tube, onJobDone)
	return client
}

export function pushJobs(tube: string, jobsCount: number, client: any, generateJobPayload: () => any) {
	assert(jobsCount > 0)	
	const jobs: Promise<any>[] = []
	for (let i = 0; i < jobsCount; i++) jobs.push(client.submitJob(tube, generateJobPayload()))
	return Promise.all(jobs)
}

function fix(t: number[]) {
	return lib.projectMinMax([2, 2], lib.round(t), [1000, 1000])
}

function fixAndApply(f: (x: number[]) => Promise<number>) {
	return (...args: number[]) => f.apply(null, fix(args))
}

export function run(cyclesCount: number = 5, f: (...args: any[]) => Promise<number>, theta: number[] = [2, 2], a: number = -100) {	
	lib.iteration(fixAndApply(f), theta, a)
		.done(t => {
			const thetaNext = fix(t)
			if (cyclesCount > 0) run(--cyclesCount, f, thetaNext, a)
			else console.log('Optimal values = ', thetaNext)
		})
}