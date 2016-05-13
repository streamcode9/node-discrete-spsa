// Main library module

function bernoulli() { return Math.random() > 0.5 ? 1 : -1 }

function vector_add(a, b) { return a.map((ai, i) => ai + b[i]) }
function vector_sub(a, b) { return a.map((ai, i) => ai - b[i]) }
function scale(a, n) { return a.map((x) => x * n) }

export function iterationSync(f, theta, a) {
	var delta = theta.map(bernoulli)
	var gradient = scale( delta, (f(vector_add(theta, delta)) - f(vector_sub(theta, delta)) / 2) * a)
	return vector_sub(theta, gradient)
}
