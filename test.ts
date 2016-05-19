import assert = require('assert')
import Promise = require('bluebird')
import lib = require('./app')

describe('Test', () => {
	it('1d optimization of x => sin(x / 100) should converge', () => {
		let theta = [0]
		for (let i = 1; i < 25; i++) {
			theta = lib.round(lib.iterationSync((x: number) => Math.sin(x / 3), theta, -1.3 * 10 / i))
		}

		assert.ok(theta[0] === 4 || theta[0] === 5)
	})

	it('async 1d optimization of x => sin(x / 100) should converge', done => {
		const run = (i = 1, theta = [0]) => {
			lib.iteration(x => new Promise<number>(resolve => resolve(Math.sin(x / 3))), theta, -1.3 * 10 / i)
				.then(t => {
					let thetaNext = lib.round(t)
					if (i < 25) run(i + 1, thetaNext)
					else {
						assert.ok(thetaNext[0] === 4 || thetaNext[0] === 5)
						done()
					}
				})
		}
		run()
	})

	it('round', () => {
		let t1 = lib.round([1.8])
		assert.ok(t1[0] === 2)
	})

	it('projectMinMax', () => {
		let t1 = lib.projectMinMax([1, 1], [5, 5], [10, 10])
		assert.ok(t1[0] === 5 || t1[1] === 5)

		let t2 = lib.projectMinMax([1, 1], [0, 11], [10, 10])
		assert.ok(t2[0] === 1 || t2[1] === 10)
	})
})

