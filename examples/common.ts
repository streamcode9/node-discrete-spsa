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