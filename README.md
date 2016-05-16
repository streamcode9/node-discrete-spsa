# discrete-spsa [![Build Status](https://travis-ci.org/streamcode9/node-discrete-spsa.svg?branch=master)](https://travis-ci.org/streamcode9/node-discrete-spsa)

An implementation of the Discrete Simultaneous Perturbation Stochastic Aproximation algorithm.

See Stacy D. Hill, "Discrete Stochastic Approximation with Application to Resource Allocation", 2005 
([pdf](http://www.jhuapl.edu/SPSA/PDF-SPSA/Hill_TechDig05.pdf))

## 0.1 Roadmap

- Synchronous `spsa.iterateSync()`
- Asynchronous `spsa.iterate()` (utilizes Bluebird promises)
- High-level `spsa.optimize()`, asynchronous only
- Disk seek concurrency optimization demo in `example/ncq`
- Network buffering optimization demo in `example/ping` 
