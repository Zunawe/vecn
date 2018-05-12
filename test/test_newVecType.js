const assert = require('assert');
const {newVecType} = require('../index.js');

console.log('test_newVecType.js');

const vec2 = newVecType(2);
const vec3 = newVecType(3);
const vec4 = newVecType(4);

assert.doesNotThrow(() => new vec3());
assert.doesNotThrow(() => new vec3(0));
assert.doesNotThrow(() => new vec3(1));
assert.doesNotThrow(() => new vec3(1, 2, 3));

var v = new vec2(5, 5);
var v2 = new vec3(5, 5, 5);
assert.doesNotThrow(() => new vec3(v));
assert.deepEqual(new vec3(v), new vec3(5, 5, 0));
assert.throws(() => new vec2(v2));

assert.throws(() => new vec3('a'), Error);
assert.throws(() => new vec3(1, 2), Error);
assert.throws(() => new vec3(1, 2, 3, 4), Error);

console.log('Done!');
