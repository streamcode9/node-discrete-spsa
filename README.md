# discrete-spsa [![Build Status]](https://travis-ci.org/streamcode9/node-discrete-spsa) [![Dependency Status]](https://david-dm.org/streamcode9/node-discrete-spsa) [![devDependency Status]] (https://david-dm.org/streamcode9/node-discrete-spsa#info=devDependencies)

An implementation of the Discrete Simultaneous Perturbation Stochastic Aproximation algorithm.

See Stacy D. Hill, "Discrete Stochastic Approximation with Application to Resource Allocation", 2005 
([pdf])

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
