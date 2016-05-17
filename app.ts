// Main library module
import Promise = require('bluebird')
import assert = require('assert')

function bernoulli() { return Math.random() > 0.5 ? 1 : -1 }

function vector_add(a: number[], b: number[]) { return a.map((ai, i) => ai + b[i]) }
function vector_sub(a: number[], b: number[]) { return a.map((ai, i) => ai - b[i]) }
function scale(a: number[], n: number) { return a.map((x) => x * n) }

export function iterationSync(f: (values: number[]) => number, theta: number[], a: number) {
	const delta = theta.map(bernoulli)
	const gradient = scale(delta, (f(vector_add(theta, delta)) - f(vector_sub(theta, delta))) / 2 * a)
	return vector_sub(theta, gradient)
}

export function iteration(f: (...args: any[]) => Promise<number>, theta: number[], a: number) : Promise<number[]> {
	const delta = theta.map(bernoulli)
	const xs = [[vector_add(theta, delta)], [vector_sub(theta, delta)]]
	return Promise.mapSeries(xs, x => f.apply(null, x)).then(ys => {
		const gradient = scale(delta, (ys[0] - ys[1]) / 2 * a)
		return vector_sub(theta, gradient)
	})
}

export function projectMinMax(min: number[], current: number[], max: number[]) : number[] {
	assert.equal(min.length, current.length)
	assert.equal(current.length, max.length)

	if (current[0] < min[0]) current[0] = min[0]
	if (current[1] < min[1]) current[1] = min[1]
	if (current[0] > max[0]) current[0] = max[0]
	if (current[1] > max[1]) current[1] = max[0]

	return current
}

export function round(values: number[]) {
	return values.map(x => Math.round(x))
}