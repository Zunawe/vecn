const assert = require('assert');
const {newVecType} = require('../index.js');

suite('vecType constructors', function (){
	var vec2, vec3;

	setup(function (){
		vec2 = newVecType(2);
		vec3 = newVecType(3);
	});

	test('should accept empty constructor', function (){
		assert.doesNotThrow(() => new vec3());
	});
	test('should accept constructor with scalar', function (){
		assert.doesNotThrow(() => new vec3(5));
	});
	test('should accept constructor with number of arguments equal to dimension', function (){
		assert.doesNotThrow(() => new vec3(1, 2, 3));
	});
	test('should accept equivalent-dimension vec', function (){
		var v = new vec3(1, 2, 3);
		assert.doesNotThrow(() => new vec3(v));
	});
	test('should promote lower-dimension vec', function (){
		var v = new vec2(1, 2);
		assert.doesNotThrow(() => new vec3(v));
	});
	test('should NOT accept non-numbers', function (){
		assert.throws(() => new vec3('a'), Error);
		assert.throws(() => new vec3(0, 'a'), Error);
		assert.throws(() => new vec3(true), Error);
		assert.throws(() => new vec3(null), Error);
	});
	test('should NOT accept higher-dimension vecs', function (){
		var v = new vec3(1, 2, 3);
		assert.throws(() => new vec2(v), Error);
	});
	test('should NOT accept more or fewer arguments than the vecType\'s dim', function (){
		assert.throws(() => new vec2(1, 2, 3), Error);
		assert.throws(() => new vec3(1, 2), Error);
	});

	test('should correctly initialize individual components', function (){
		var v = new vec3(1, 3, 5);
		assert.equal(v[0], 1);
		assert.equal(v[1], 3);
		assert.equal(v[2], 5);
	});
	test('should initialize to zeroes if constructor is empty', function (){
		assert.deepEqual(new vec3(), new vec3(0, 0, 0));
	});
	test('should initialize all components to same scalar if constructor has one argument', function (){
		assert.deepEqual(new vec3(3), new vec3(3, 3, 3));
	});
});
