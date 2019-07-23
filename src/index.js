class Planner {
  constructor (items, runner) {
    this._items = new Set(items)
    this._runner = runner
    this._args = null
    this._resolvers = null
    this._error = null
  }

  resolve (item) {
    if (this._error) {
      return
    }

    this._items.delete(item)

    const {size} = this._items

    if (size > 0) {
      return
    }

    const runner = this._runner
    this._runner = null
    this._result = runner()

    if (!this._resolvers) {
      return
    }

    const [resolve, reject] = this._resolvers
    this._resolvers = null
    Promise.resolve(this._result).then(resolve, reject)
  }

  reject (err) {
    if (this._error) {
      return
    }

    this._error = err

    if (!this._resolvers) {
      return
    }

    const [, reject] = this._resolvers
    this._resolvers = null
    reject(err)
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
      ? Promise.resolve(this._result)
      : new Promise((resolve, reject) => {
        this._resolvers = [resolve, reject]
      })

    return promise.then(...args)
  }
}

module.exports = Planner
