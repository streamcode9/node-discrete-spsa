import assert = require('assert')
import lib = require('./app')

describe("Test", () => {
    it("1d optimization of x => sin(x / 100) should converge", () => {
		let theta = [0]
		for (var i = 1; i < 25; i++)
		{
			theta = lib.iterationSync(x => Math.sin(x[0] / 3), theta, -1.3 * 10 / i).map((x => Math.round(x)))
		}

        assert.ok(theta[0] == 4 || theta[0] == 5)
    })

	it("async 1d optimization of x => sin(x / 100) should converge", done => {
		let thetaPromise : Promise<number[]>

		const run = (i = 1, theta = [0]) => {
			thetaPromise = lib.iteration(x => new Promise<number>(resolve => resolve(Math.sin(x[0] / 3))), theta, -1.3 * 10 / i)
			thetaPromise.then(t => {
				let thetaNext = t.map((x => Math.round(x)))
				if (i < 25) run(i + 1, thetaNext)
				else {
					assert.ok(thetaNext[0] == 4 || thetaNext[0] == 5)
					done()
				}
			})
		}
		
		run()        
    })
})

