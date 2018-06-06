const assert = require('assert')
const vecn = require('../src/index.js')

const {vec3, vec4} = vecn

suite('swizzle', function () {
  var vec5
  var v1, v2, v3

  setup(function () {
    vec5 = vecn.getVecType(5)

    v1 = vec3(1, 2, 3)
    v2 = vec4(4, 5, 6, 7)
    v3 = vec5(8, 9, 10, 11, 12)
  })

  test('should allow single value access by name', function () {
    assert.equal(v2.x, 4)
    assert.equal(v2.y, 5)
    assert.equal(v2.z, 6)
    assert.equal(v2.w, 7)
  })

  test('should return appropriately-sized vec for swizzling', function () {
    assert.equal(typeof v1.x, 'number')
    assert.equal(v1.xx.dim, 2)
    assert.equal(v1.xxxx.dim, 4)
    assert.equal(v1['x'.repeat(20)].dim, 20)
  })

  test('should NOT allow swizzling on large vectors', function () {
    assert.equal(v3.x, undefined)
  })

  test('should NOT allow swizzling beyond a vector\'s dimension', function () {
    assert.equal(v1.w, undefined)
    assert.equal(v1.xxyzxw, undefined)
  })

  test('should swizzle correctly', function () {
    assert.deepEqual(v1.xyxxz, vec5(1, 2, 1, 1, 3))
    assert.deepEqual(v2.wxz, vec3(7, 4, 6))
  })

  test('should allow rgba aliases for swizzling', function () {
    assert.deepEqual(v1.rgr, vec3(1, 2, 1))
  })

  test('should allow stpq aliases for swizzling', function () {
    assert.deepEqual(v1.sps, vec3(1, 3, 1))
  })

  test('should allow assignment by name', function () {
    var v = vec3(1, 2, 3)
    v.z = 42
    assert.deepEqual(v, vec3(1, 2, 42))
  })

  test('should allow assignment using swizzling', function () {
    var v = vec3(1, 2, 3)
    v.xy = v1.yy
    assert.deepEqual(v, vec3(2, 2, 3))
  })

  test('should NOT allow assignment beyond dimension', function () {
    var v = vec3(1, 2, 3)
    var copy = vec3(v)

    v.w = 5
    assert.deepEqual(v, copy)
    v.xw = [1, 2]
    assert.deepEqual(v, copy)
  })

  test('should NOT allow double assignment', function () {
    var v = vec3(1, 2, 3)
    assert.throws(() => { v.xx = [1, 2] }, Error)
  })

  test('should NOT allow assignment with invalid type', function () {
    var v = vec3(1, 2, 3)
    assert.throws(() => { v.x = true }, TypeError)
    assert.throws(() => { v.x = 'string' }, TypeError)
    assert.throws(() => { v.x = assert }, TypeError)
    assert.throws(() => { v.x = {} }, TypeError)
    assert.throws(() => { v.x = [] }, TypeError)

    assert.throws(() => { v.xy = ['a', 1] })
    assert.throws(() => { v.xy = [undefined, 1] })
    assert.throws(() => { v.xy = [0, assert] })
    assert.throws(() => { v.xy = ['a', null] })
    assert.throws(() => { v.xy = [[], 1] })
  })

  test('should NOT allow assignment with invalid length', function () {
    var v = vec3(1, 2, 3)
    assert.throws(() => { v.xy = v.zzz }, Error)
    assert.throws(() => { v.xy = 4 }, Error)
  })
})
