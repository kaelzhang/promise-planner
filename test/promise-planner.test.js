const test = require('ava')
const log = require('util').debuglog('promise-planner')
const Planner = require('../src')

test('success', async t => {
  const result = []
  const items = [1, 2, 3]
  const p = new Planner(items, (...args) => {
    t.deepEqual(args, [1, 2, 3])
    result.push(4)
    return 5
  })

  items.forEach((item, index) => {
    setTimeout(() => {
      result.push(item)
      p.resolve(item, item)
    }, (index + 1) * 100)
  })

  t.deepEqual(await p, 5)
  t.deepEqual(result, [1, 2, 3, 4])
  t.deepEqual(await p, 5)
})

test('all resolved before await', async t => {
  const p = new Planner([1], () => 1)
  p.resolve(1, 2)
  t.is(await p, 1)
})

test('throw in runner', async t => {
  const p = new Planner([1], () => {
    throw new Error('foo')
  })

  p.resolve(1)
  await t.throwsAsync(() => p, 'foo')

  // Test the case that there is no onReject method for .then
  await new Promise(resolve => {
    p.then(() => {
      // do nothing
    }).catch(err => {
      t.is(err.message, 'foo')
      resolve()
    })
  })

  await new Promise(resolve => {
    p.catch(err => {
      t.is(err.message, 'foo')
      resolve()
    })
  })
})

test('reject before await', async t => {
  const p = new Planner([1, 2], () => Promise.reject(new Error('baz')))
  p.reject(new Error('foo'))
  p.reject(new Error('bar'))
  p.resolve(1, 2)

  await t.throwsAsync(() => p, 'foo')
})

test('reject after await', async t => {
  const p = new Planner([1, 2], () => Promise.reject(new Error('baz')))

  setTimeout(() => {
    p.reject(new Error('foo'))
  }, 0)

  await t.throwsAsync(() => p, 'foo')
})

const ERRORS = [
  ['INVALID_PLANS', () => new Planner()],
  ['DUPLICATE_PLANS', () => new Planner(['foo', 'foo'])],
  ['NO_PLANS', () => new Planner([])],
  ['DUPLICATE_PLAN_RESOLVE', () => {
    const p = new Planner([1, 2], () => {})
    p.resolve(1, 1)
    p.resolve(1, 1)
  }],
  ['INVALID_DONE', () => new Planner([1])],
  ['INVALID_PLAN', () => {
    const p = new Planner([1], () => {})
    p.resolve(0)
  }],
]

ERRORS.forEach(([code, factory]) => {
  test(code, t => {
    try {
      factory()
    } catch (error) {
      log(error.stack)

      t.is(error.code, code)
      return
    }

    t.fail('should fail')
  })
})
