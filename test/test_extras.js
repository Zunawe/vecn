const assert = require('assert')
const {vec2, vec3} = require('../src/index.js')

suite('extras', function () {
  var v

  setup(function () {
    v = vec3(1, 5, 5)
  })

  test('sum', function () {
    assert.equal(v.sum(), 11)
  })

  test('argmax', function () {
    assert.deepEqual(v.argmax(), [1, 2])
  })

  test('argmin', function () {
    assert.deepEqual(v.argmin(), [0])
  })

  test('choose', function () {
    assert.deepEqual(v.choose([2, 0]), vec2(5, 1))
  })

  test('choose throws for invalid input', function () {
    assert.throws(() => { v.choose([-1]) }, RangeError)
    assert.throws(() => { v.choose([1.2, 2]) }, RangeError)
    assert.throws(() => { v.choose([3]) }, RangeError)
    assert.throws(() => { v.choose(assert) }, TypeError)
  })

  test('max', function () {
    assert.equal(v.max(), 5)
  })

  test('min', function () {
    assert.equal(v.min(), 1)
  })

  test('equals', function () {
    assert(v.equals(vec3(1, 0, 0).plus(vec3(0, 5, 5))))
  })
})

suite('liberal inputs', function () {
  var v

  setup(function () {
    v = vec3(1, 2, 3)
  })

  test('should take arrays for operations', function () {
    assert.doesNotThrow(() => v.plus([5, 6, 7]))
    assert.doesNotThrow(() => v.minus([5, 6, 7]))
    assert.doesNotThrow(() => v.times([5, 6, 7]))
    assert.doesNotThrow(() => v.div([5, 6, 7]))
    assert.doesNotThrow(() => v.dot([5, 6, 7]))
    assert.throws(() => v.plus([5, 6, 7, 8]), Error)
  })
})
