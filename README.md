[![Build Status](https://travis-ci.org/kaelzhang/promise-planner.svg?branch=master)](https://travis-ci.org/kaelzhang/promise-planner)
[![Coverage](https://codecov.io/gh/kaelzhang/promise-planner/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/promise-planner)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/promise-planner?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/promise-planner)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/promise-planner.svg)](http://badge.fury.io/js/promise-planner)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/promise-planner.svg)](https://www.npmjs.org/package/promise-planner)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/promise-planner.svg)](https://david-dm.org/kaelzhang/promise-planner)
-->

# promise-planner

Plan multiple named tasks and only resolve after all tasks are marked as done

## Install

```sh
$ npm i promise-planner
```

## Usage

```js
const Planner = require('promise-planner')

const plan = new Planner(
  ['foo', 'bar', 'baz'],
  async (...args) => {
    console.log('args', args)
    return doSomethingAsync(...args)
  }
)

plan.then(() => {
  console.log('completed')
})

plan.resolve('foo', 1)
plan.resolve('bar', 2)
plan.resolve('baz', 3)

// args [1, 2, 3]
// completed
```

## License

[MIT](LICENSE)
