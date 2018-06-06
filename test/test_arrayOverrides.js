const assert = require('assert')
const {vec2, vec3, isVec, getVecType} = require('../src/index.js')

suite('array overrides', function () {
  var v
  var vec5 = getVecType(5)

  setup(function () {
    v = vec3(1, 2, 3)
  })

  suite('concat', function () {
    test('should return a vec', function () {
      assert(isVec(v.concat([1, 2])))
    })

    test('should correctly concat vecs', function () {
      assert.deepEqual(v.concat([1, 2]), vec5(1, 2, 3, 1, 2))
    })
  })

  suite('filter', function () {
    test('should filter to lower-dimension vectors', function () {
      assert.deepEqual(v.filter((v) => v > 1), vec2(2, 3))
      assert(isVec(v.filter((v) => v > 1)))
    })

    test('should become array for single number', function () {
      assert.deepEqual(v.filter((v) => v > 2), [3])
      assert(!isVec(v.filter((v) => v > 2)))
    })

    test('should become array for empty array', function () {
      assert.deepEqual(v.filter((v) => v > 3), [])
      assert(!isVec(v.filter((v) => v > 3)))
    })
  })

  suite('map', function () {
    test('should return a vec if function maps to numbers', function () {
      assert(isVec(v.map((n) => n + 1)))
    })

    test('should return an Array if result has non-numbers', function () {
      assert(!isVec(v.map((n) => n > 1 ? n : n.toString())))
    })
  })

  suite('slice', function () {
    test('should slice to lower-dimension vectors', function () {
      assert.deepEqual(v.slice(), v)
      assert(isVec(v.slice()))
      assert.deepEqual(v.slice(1), v.yz)
      assert(isVec(v.slice(1)))
    })

    test('should become array for single number', function () {
      assert.deepEqual(v.slice(0, 1), [1])
      assert(!isVec(v.slice(0, 1)))
    })

    test('should become array for empty array', function () {
      assert.deepEqual(v.slice(3, 3), [])
      assert(!isVec(v.slice(3, 3)))
    })
  })

  suite('splice', function () {
    test('should mutate if the dimension is the same after the operation', function () {
      var copy = vec3(v)
      copy.splice(0, 1, 5)
      assert(isVec(copy))
    })

    test('should err if the dimension is not the same after the operation', function () {
      assert.throws(() => v.splice(0, 2, 5), Error)
    })
  })
})

suite('illegal methods', function () {
  var v

  setup(function () {
    v = vec3(1, 2, 3)
  })

  test('should disallow direct calls to push', function () {
    assert(v.push === undefined)
  })

  test('should disallow direct calls to pop', function () {
    assert(v.pop === undefined)
  })

  test('should disallow direct calls to shift', function () {
    assert(v.shift === undefined)
  })

  test('should disallow direct calls to unshift', function () {
    assert(v.unshift === undefined)
  })
})
