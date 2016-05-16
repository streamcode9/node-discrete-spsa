# discrete-spsa [![Build Status]](https://travis-ci.org/streamcode9/node-discrete-spsa) [![Dependency Status]](https://david-dm.org/streamcode9/node-discrete-spsa) [![devDependency Status]] (https://david-dm.org/streamcode9/node-discrete-spsa#info=devDependencies)

An implementation of the Discrete Simultaneous Perturbation Stochastic Aproximation algorithm.

See Stacy D. Hill, "Discrete Stochastic Approximation with Application to Resource Allocation", 2005 
([pdf])

The algorithm is suitable for optimization tasks in feedback control and 
simulation-based optimization. It iteratively improves an array of interdependent
parameters based on subsequent benchmarks. The algorithm requires only 2 benchmark
runs per iteration regardless the number of parameters, so it is suitable for optimization
problems with large number of parameters which are simultaneously improved from run to run.

Common examples of problems this algorithm is suitable for are finding buffer sizes and worker
counts in distributed systems, finding optimal memory and CPU frequency in overclocking scenarios
and so on.

## 0.1 Roadmap

- Synchronous `spsa.iterateSync()`
- Asynchronous `spsa.iterate()` (utilizes Bluebird promises)
- High-level `spsa.optimize()`, asynchronous only
- Disk seek concurrency optimization demo in `example/ncq`
- Network buffering optimization demo in `example/ping` 

[pdf]: http://www.jhuapl.edu/SPSA/PDF-SPSA/Hill_TechDig05.pdf
[Build Status]: https://travis-ci.org/streamcode9/node-discrete-spsa.svg?branch=master
[Dependency Status]: https://david-dm.org/streamcode9/node-discrete-spsa.svg
[devDependency Status]: https://david-dm.org/streamcode9/node-discrete-spsa/dev-status.svg
