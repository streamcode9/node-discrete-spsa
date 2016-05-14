import assert = require('assert')
import lib = require('./app')

describe("Test", () => {
    it("1d optimization of x => sin(x / 100) should converge", () => {
		var theta = [0]
		for (var i = 1; i < 25; i++)
		{
			theta = lib.iterationSync(x => Math.sin(x[0] / 3), theta, -1.3 * 10 / i).map((x => Math.round(x)))
		}

        assert.ok(theta[0] == 4 || theta[0] == 5)
    })
})

