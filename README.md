# discrete-spsa [![Build Status]](https://travis-ci.org/streamcode9/node-discrete-spsa) 

[![Dependency Status]](https://david-dm.org/streamcode9/node-discrete-spsa) [![devDependency Status]] (https://david-dm.org/streamcode9/node-discrete-spsa#info=devDependencies) 

[![Code Climate](https://codeclimate.com/github/streamcode9/node-discrete-spsa/badges/gpa.svg)](https://codeclimate.com/github/streamcode9/node-discrete-spsa) [![Test Coverage](https://codeclimate.com/github/streamcode9/node-discrete-spsa/badges/coverage.svg)](https://codeclimate.com/github/streamcode9/node-discrete-spsa/coverage) [![Issue Count](https://codeclimate.com/github/streamcode9/node-discrete-spsa/badges/issue_count.svg)](https://codeclimate.com/github/streamcode9/node-discrete-spsa)

An implementation of the Discrete Simultaneous Perturbation Stochastic Aproximation algorithm.

See Stacy D. Hill, "Discrete Stochastic Approximation with Application to Resource Allocation", 2005 
([pdf])

The algorithm is suitable for optimization tasks in feedback control and 
simulation-based optimization. It iteratively improves an array of interdependent
parameters based on subsequent benchmarks. The algorithm requires only 2 benchmark
runs per iteration regardless the number of parameters, so it is suitable for optimization
problems with large number of parameters which are simultaneously improved from run to run. 
Another advantage is that the algorithm works well with unreliable benchmarks. No averaging
or measures to guarantee statistical significance of benchmarks is required.

Common examples of problems this algorithm is suitable for are finding buffer sizes and worker
counts in distributed systems, finding optimal memory and CPU frequency in overclocking scenarios
and so on.

## The Algorithm

On each iteration:

- a random direction of perturbation is chosen
- the benchmark is run twice with a positive and a negative perturbation of current guess in that direction
- the stochastic gradient is calculated from the benchmark results
- the next guess is calculated by multiplying the gradient by the learning rate parameter

In pseudo-code:

```Javascript
{ xs, step } = perturb(initialParameters, learningRate)
ys[0] = benchmark(xs[0])
ys[1] = benchmark(xs[1])
improvedParameters = step(ys)
```

- Choose values for each parameter and feed them to the algorithm
- Run the benchmark twice with the parameters suggested by the algorithm and collect the results
- Feed the results to the algorithm to get the improved parameters
- Use the improved parameters in next iteration
- Stop when benchmark results stop to improve


The `perturb()` function implements the algorithm. The rest of the library are wrappers to use it more easily.

perturb() accepts `currentGuess[]` and `learningRate`, and returns `xs[]` and `step()` 
 - `currentGuess`: an array numbers, current parameters
 - `learningRate`: a positive or negative number. Use positive numbers to minimize benchmark results. Use negative numbers to maximize bechmark results. Large absolute values mean large jump distance at each iteration. Use smaller values as you get closer to the optimum. 
 - `xs` is a 2-element array. Run benchmark twice with the provided sets of parameters.
 - feed benchmark results as an array of 2 numbers to `step()` function, and obtain `improvedParameters`
 - if improved parameters are out of range, fix them: round them and clip to closest valid values. Many methods of rounding and chosing the closest valid values are possible.
 - run the next iteration
 
`iterate()` and `iterateSync()` use `perturb()` to run steps 1-4 in synchronous and asynchronous manner respectively

`optimize()` runs all the 6 steps in a loop 


## 0.2 roadmap

- Field-test with real problems
- Jupyter visualizations

## 0.1 (current)

- Synchronous `spsa.iterateSync()`
- Asynchronous `spsa.iterate()` (utilizes Bluebird promises)
- High-level `spsa.optimize()`, asynchronous only
- Disk seek concurrency optimization demo in `examples/ncq.ts`
- Network buffering optimization demo in `example/ping.ts` 

[pdf]: http://www.jhuapl.edu/SPSA/PDF-SPSA/Hill_TechDig05.pdf
[Build Status]: https://travis-ci.org/streamcode9/node-discrete-spsa.svg?branch=master
[Dependency Status]: https://david-dm.org/streamcode9/node-discrete-spsa.svg
[devDependency Status]: https://david-dm.org/streamcode9/node-discrete-spsa/dev-status.svg
