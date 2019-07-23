const {Errors} = require('err-object')

const {TE, E, error} = new Errors({
  messagePrefix: '[promise-planner] '
})

TE('INVALID_PLANS', 'plans must be an array')

E('NO_PLANS', 'plans must not be an empty array', RangeError)

TE('INVALID_DONE', 'done must be a function')

E('DUPLICATE_PLANS', 'duplicate plans found', RangeError)

E('INVALID_PLAN', 'a plan must be one of %s, but got %j', RangeError)

E('DUPLICATE_PLAN_RESOLVE', 'plan %j is resolved more than once')

module.exports = error
