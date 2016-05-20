import assert = require('assert')
import fs = require('fs')
import Promise = require('bluebird')
import lib = require('../app')
import common = require('./common')

const jobsCount = 10

const fd = fs.openSync('123.txt', 'r')
const fileSize = fs.fstatSync(fd).size
assert(fileSize > 100 * 1024 * 1024, 'size is less than 100 MBs')

function onJob(payload: string) : Promise<Buffer> {
	const { pageSize, pageNo } = JSON.parse(payload)
	assert(pageSize > 0)
	return new Promise<Buffer>(resolve => {
		fs.read(fd, new Buffer(pageSize), 0, pageSize, pageNo * pageSize, (err, bytesRead, buffer) => {
			assert.equal(err, null)
			assert.equal(bytesRead, pageSize, 'cannot read')
			resolve(buffer)
		})
	})
}

function generateJobPayload(pageSize: number) {
	pageSize *= 65536
	const pageCount = Math.floor(fileSize / pageSize)
	assert(jobsCount > 0)
	assert(pageCount > 100, 'low page count')

	const pageNo = Math.floor(Math.random() * pageCount)
	assert(pageNo * pageSize < fileSize, 'offset out of range')
	assert(pageNo >= 0 && pageNo < pageCount)

	return JSON.stringify({ pageNo, pageSize })
}

function ping(maxJobs: number, pageSize: number) : Promise<number> {
	const maxQueued = 1

	let calcSpeed = (timeMs: number) => {
		const speed = (jobsCount * pageSize) / timeMs
		console.log({ maxJobs, pageSize, speed: speed.toPrecision(2) })
		return speed
	}
	return common.run({ onJob, maxJobs, maxQueued, jobsCount, calcSpeed, generateJobPayload : generateJobPayload.bind(null, pageSize) })
}

lib.optimize(10, ping, [2, 2], -100).done(x => console.log(x))
