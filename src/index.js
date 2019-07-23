const {isArray, isFunction} = require('core-util-is')

const error = require('./error')

class Planner {
  constructor (items, done) {
    if (!isArray(items)) {
      throw error('INVALID_PLANS', items)
    }

    const {length} = items

    if (length === 0) {
      throw error('NO_PLANS')
    }

    const plans = [...new Set(items)]

    if (plans.length !== items.length) {
      throw error('DUPLICATE_PLANS')
    }

    if (!isFunction(done)) {
      throw error('INVALID_DONE', done)
    }

    this._plans = plans
    this._done = done
    this._args = []
    this._resolvers = null
    this._error = null

    this._resolved = 0
    this._length = length
  }

  resolve (plan, arg) {
    if (this._error) {
      return
    }

    const index = this._plans.indexOf(plan)

    if (index === - 1) {
      throw error('INVALID_PLAN', plan, this._plans)
    }

    if (index in this._args) {
      throw error('DUPLICATE_PLAN_RESOLVE', plan)
    }

    this._args[index] = arg

    if (++ this._resolved !== this._length) {
      return
    }

    const done = this._done
    this._done = null

    try {
      this._result = Promise.resolve(done(...this._args))
      this._args.length = 0
    } catch (err) {
      this._reject(err)
      return
    }

    // Not be awaited yet
    if (!this._resolvers) {
      return
    }

    const [resolve, reject] = this._resolvers
    this._resolvers = null
    this._result.then(resolve, reject)
  }

  _reject (err) {
    this._error = err

    if (!this._resolvers) {
      return
    }

    const [, reject] = this._resolvers
    this._resolvers = null
    reject(err)
  }

  reject (err) {
    if (this._error) {
      return
    }

    this._reject(err)
  }

  then (...args) {
    if (this._error) {
      const [, reject] = args
      const rejected = Promise.reject(this._error)

      return reject
        ? rejected.catch(reject)
        : rejected
    }

    const promise = this._result
      ? this._result
      : new Promise((resolve, reject) => {
        this._resolvers = [resolve, reject]
      })

    return promise.then(...args)
  }
}

module.exports = Planner
