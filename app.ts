// Main library module
import Promise = require('bluebird')
import assert = require('assert')

function bernoulli() { return Math.random() > 0.5 ? 1 : -1 }

function vector_add(a: number[], b: number[]) { return a.map((ai, i) => ai + b[i]) }
function vector_sub(a: number[], b: number[]) { return a.map((ai, i) => ai - b[i]) }

function perturb(theta: number[], a: number) {
	const delta = theta.map(bernoulli)
	return {
		xs: [vector_add(theta, delta), vector_sub(theta, delta)],
		step: (ys: number[]) =>
			vector_sub(theta, delta.map(x => x * (ys[0] - ys[1]) / 2 * a))
	}
}

function passArray(f: (...args: number[]) => (number | Promise<number>)) {
	return (x: number[]) => f.apply(null, x)
}

export function iterationSync(f: (...args: number[]) => number, theta: number[], a: number) {
	const {xs, step} = perturb(theta, a)
	return step(xs.map(passArray(f)))
}

export function iteration(f: (...args: number[]) => Promise<number>, theta: number[], a: number) : Promise<number[]> {
	const {xs, step} = perturb(theta, a)
	return Promise.mapSeries(xs, passArray(f)).then(step)
}

export function projectMinMax(min: number[], current: number[], max: number[]) : number[] {
	assert.equal(min.length, current.length)
	assert.equal(current.length, max.length)

	return current.map((value, i) => Math.min(value, max[i])).map((value, i) => Math.max(value, min[i]))
}

export function round(values: number[]) {
	return values.map(x => Math.round(x))
}

function fix(t: number[]) {
	return projectMinMax([2, 2], round(t), [1000, 1000])
}

function fixAndApply(f: (...args: number[]) => Promise<number>) {
	return (...args: number[]) => f.apply(null, fix(args))
}

function pushN(n: number, val: any = null ) {
	const a: any[] = []
	for (let i = 0; i < n; i++) a.push(val)
	return a
}

export function optimize(cyclesCount: number, f: (...args: number[]) => Promise<number>, theta: number[], a: number) {
	let thetaNext = theta
	let ff = fixAndApply(f)
	return Promise.mapSeries(pushN(cyclesCount), () =>
		iteration(ff, thetaNext, a)
		.then(t => {
			thetaNext = t
			return fix(thetaNext)
		})
	)
}
