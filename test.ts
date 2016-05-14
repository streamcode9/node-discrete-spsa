import assert = require('assert')
import lib = require('./app')

function test()
{
	var theta = [0]
	for (var i = 1; i < 25; i++)
	{
		theta = lib.iterationSync(x => Math.sin(x[0] / 3), theta, -1.3 * 10 / i).map((x => Math.round(x)))
	}
	assert.ok(theta[0] == 4 || theta[0] == 5)
}

for (var i = 0; i < 10; i++)
{
	console.log(i, Math.sin(i / 3).toFixed(2))
}

test()
console.log('test ok')

