const assert = require('assert');
const {newVecType} = require('../index.js');

console.log('test_vectorOperations.js');

const vec3 = newVecType(3);
const vec2 = newVecType(2);

var v1 = new vec3(1, 2, 3);
var v2 = new vec3(4, 5, 6);

var v3 = new vec2(1, 1);

assert.deepEqual(v1.plus(v2), new vec3(5, 7, 9));
assert.deepEqual(v1.plus(5), new vec3(6, 7, 8));
assert.deepEqual(v1.plus(-5), new vec3(-4, -3, -2));

assert.deepEqual(v1.minus(v2), new vec3(-3, -3, -3));
assert.deepEqual(v1.minus(1), new vec3(0, 1, 2));
assert.deepEqual(v1.minus(-2), new vec3(3, 4, 5));

assert.deepEqual(v1.times(v2), new vec3(4, 10, 18));
assert.deepEqual(v1.times(2), new vec3(2, 4, 6));

assert.deepEqual(v1.neg(), new vec3(-1, -2, -3));

assert.deepEqual(v1.div(v2), new vec3(1/4, 2/5, 3/6));
assert.deepEqual(v1.div(3), new vec3(1/3, 2/3, 3/3));

assert.deepEqual(v1.pow(0), new vec3(1, 1, 1));
assert.deepEqual(v1.pow(3), new vec3(1, 8, 27));

assert.deepEqual(v1.dot(v2), 32);


assert.deepEqual(v1.plus(v3), new vec3(2, 3, 3));

assert.equal(v1.plus(v2.times(2)).minus(new vec3(0.5)).dot(new vec3(1, 2, 1)), 46);

console.log('Done!');
