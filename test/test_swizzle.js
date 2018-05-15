const vec = require('../index.js');
const assert = require('assert');

const {vec3, vec4} = vec;

suite('swizzle', function (){
	var vec5;
	var v1, v2, v3;

	setup(function (){
		vec5 = vec.newVecType(5);

		v1 = vec3(1, 2, 3);
		v2 = vec4(4, 5, 6, 7);
		v3 = vec5(8, 9, 10, 11, 12);
	});

	test('should allow single value access by name', function (){
		assert.equal(v2.x, 4);
		assert.equal(v2.y, 5);
		assert.equal(v2.z, 6);
		assert.equal(v2.w, 7);
	});

	test('should return appropriately-sized vec for swizzling', function (){
		assert.equal(typeof(v1.x), 'number');
		assert.equal(v1.xx.dim, 2);
		assert.equal(v1.xxxx.dim, 4);
		assert.equal(v1['x'.repeat(20)].dim, 20);
	});

	test('should NOT allow swizzling on large vectors', function (){
		assert.equal(v3.x, undefined);
	});

	test('should NOT allow swizzling beyond a vector\'s dimension', function (){
		assert.equal(v1.w, undefined);
		assert.equal(v1.xxyzxw, undefined);
	});

	test('should swizzle correctly', function (){
		assert.deepEqual(v1.xyxxz, new vec5(1, 2, 1, 1, 3));
		assert.deepEqual(v2.wxz, new vec3(7, 4, 6));
	});
});
