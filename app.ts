// Main library module

function bernoulli() { return Math.random() > 0.5 ? 1 : -1 }

function vector_add(a: number[], b: number[]) { return a.map((ai, i) => ai + b[i]) }
function vector_sub(a: number[], b: number[]) { return a.map((ai, i) => ai - b[i]) }
function scale(a: number[], n: number) { return a.map((x) => x * n) }

export function iterationSync(f: (values: number[]) => number, theta: number[], a: number) {
	var delta = theta.map(bernoulli)
	var gradient = scale(delta, (f(vector_add(theta, delta)) - f(vector_sub(theta, delta))) / 2 * a)
	return vector_sub(theta, gradient)
}
