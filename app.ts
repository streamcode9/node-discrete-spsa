// Main library module
import Promise = require('bluebird')
import assert = require('assert')

function bernoulli() { return Math.random() > 0.5 ? 1 : -1 }

function vector_add(a: number[], b: number[]) { return a.map((ai, i) => ai + b[i]) }
function vector_sub(a: number[], b: number[]) { return a.map((ai, i) => ai - b[i]) }
function scale(a: number[], n: number) { return a.map((x) => x * n) }

export function iterationSync(f: (...args: number[]) => number, theta: number[], a: number) {
	const delta = theta.map(bernoulli)
	const gradient = scale(delta, (f.apply(null, vector_add(theta, delta)) - f.apply(null, vector_sub(theta, delta))) / 2 * a)
	return vector_sub(theta, gradient)
}

export function iteration(f: (...args: any[]) => Promise<number>, theta: number[], a: number) : Promise<number[]> {
	const delta = theta.map(bernoulli)
	const xs = [vector_add(theta, delta), vector_sub(theta, delta)]
	return Promise.mapSeries(xs, x => f.apply(null, x)).then(ys => {
		const gradient = scale(delta, (ys[0] - ys[1]) / 2 * a)
		return vector_sub(theta, gradient)
	})
}

export function projectMinMax(min: number[], current: number[], max: number[]) : number[] {
	assert.equal(min.length, current.length)
	assert.equal(current.length, max.length)

	return current.map((value, i) => Math.min(value, max[i])).map((value, i) => Math.max(value, min[i]))
}

export function round(values: number[]) {
	return values.map(x => Math.round(x))
}