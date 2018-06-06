const assert = require('assert')
const {vec2, vec3} = require('../src/index.js')

suite('vecType constructors', function () {
  test('should accept empty constructor', function () {
    assert.doesNotThrow(() => vec3())
  })

  test('should accept constructor with scalar', function () {
    assert.doesNotThrow(() => vec3(5))
  })

  test('should accept constructor with number of arguments equal to dimension', function () {
    assert.doesNotThrow(() => vec3(1, 2, 3))
  })

  test('should accept equivalent-dimension vec', function () {
    var v = vec3(1, 2, 3)
    assert.doesNotThrow(() => vec3(v))
  })

  test('should promote lower-dimension vec', function () {
    var v = vec2(1, 2)
    assert.doesNotThrow(() => vec3(v))
  })

  test('should NOT accept non-numbers', function () {
    assert.throws(() => vec3('a'), Error)
    assert.throws(() => vec3(0, 'a'), Error)
    assert.throws(() => vec3(true), Error)
    assert.throws(() => vec3(null), Error)
  })

  test('should NOT accept higher-dimension vecs', function () {
    var v = vec3(1, 2, 3)
    assert.throws(() => vec2(v), Error)
  })

  test('should NOT accept more or fewer arguments than the vecType\'s dim', function () {
    assert.throws(() => vec2(1, 2, 3), Error)
    assert.throws(() => vec3(1, 2), Error)
  })

  test('should correctly initialize individual components', function () {
    var v = vec3(1, 3, 5)
    assert.equal(v[0], 1)
    assert.equal(v[1], 3)
    assert.equal(v[2], 5)
  })

  test('should initialize to zeroes if constructor is empty', function () {
    assert.deepEqual(vec3(), vec3(0, 0, 0))
  })

  test('should initialize all components to same scalar if constructor has one argument', function () {
    assert.deepEqual(vec3(3), vec3(3, 3, 3))
  })
})
