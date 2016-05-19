import assert = require('assert')
import fs = require('fs')
import Promise = require('bluebird')
import lib = require('../app')
const ab = require('abraxas')

ab.Server.listen()

const tubeName = 'test_tube'
const jobsCount = 10

const fd = fs.openSync('123.txt', 'r')
const fileSize = fs.fstatSync(fd).size
assert(fileSize > 100 * 1024 * 1024, 'size is less than 100 MBs')

function readPageFromFile(pageSize: number, pageNo: number) : Promise<Buffer> {
	assert(pageSize > 0)
	return new Promise<Buffer>(resolve => {
		fs.read(fd, new Buffer(pageSize), 0, pageSize, pageNo * pageSize, (err, bytesRead, buffer) => {
			assert.equal(err, null)
			assert.equal(bytesRead, pageSize, 'cannot read')
			resolve(buffer)
		})
	})
}

function pushJobs(jobsCount: number, client: any, tube: string, pageSize: number) {

	pageSize *= 65536
	const pageCount = Math.floor(fileSize / pageSize)
	assert(jobsCount > 0)
	assert(pageCount > 100, 'low page count')
	const jobs: Promise<any>[] = []
	for (let i = 0; i < jobsCount; i++) {
		const pageNo = Math.floor(Math.random() * pageCount)
		assert(pageNo * pageSize < fileSize, 'offset out of range')
		assert(pageNo >= 0 && pageNo < pageCount)
		jobs.push(client.submitJob(tube, JSON.stringify({pageNo, pageSize})))
	}
	return Promise.all(jobs)
}

function createClient(tube: string, maxJobs: number, maxQueued: number, pageSize: number) {
	const client = ab.Client.connect({ maxJobs: maxJobs, maxQueued: maxQueued })
	client.registerWorker(tube, (job: any) => {
		const { pageSize, pageNo } = JSON.parse(job.payload)
		readPageFromFile(pageSize, pageNo).then(data => job.end(data))
	})
	return client
}


let tube = tubeName
function ping(maxJobs: number, pageSize: number) : Promise<number> {
	const maxQueued = 1
	const client = createClient(tube, maxJobs, maxQueued, pageSize)

	return pushJobs(jobsCount, client, tube, pageSize).then(() => {
		const start = Date.now()
		return pushJobs(jobsCount, client, tube, pageSize).then(() => {
			client.forgetAllWorkers()
			client.disconnect()
			const speed = (jobsCount * pageSize) / (Date.now() - start)
			console.log({maxJobs, pageSize, speed : speed.toPrecision(2)})
			return speed
		})
	})
}

function fix(t: number[]) {
	return lib.projectMinMax([2, 2], lib.round(t), [1000, 1000])
}

function fixedPing(...args: number[]) {
	return ping.apply(null, fix(args))
}

function run(i: number = 1, theta: number[] = [2, 2]) {
	lib.iteration(fixedPing, theta, -100)
		.done(t => {
			const thetaNext = fix(t)
			if (i < 25000) run(i + 1, thetaNext)
			else console.log('DONE')
		})
}
run()
