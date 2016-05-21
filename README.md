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
