const assert = require('assert');
const vec = require('../index.js');

const {vec3} = vec;

suite('enumerables', function (){
	var v;
	var enumerations;

	setup(function (){
		v = new vec3(1, 2, 3);
		enumerations = [];
		for(i in v){
			enumerations.push(i);
		}
	});

	test('should NOT enumerate dimension', function(){
		assert(!enumerations.includes('dim'));
	});
	test('should enumerate indices', function(){
		assert(enumerations.includes('0'));
		assert(enumerations.includes('1'));
		assert(enumerations.includes('2'));
	});
	test('should enumerate ONLY indices', function(){
		assert(enumerations.includes('0'));
		assert(enumerations.includes('1'));
		assert(enumerations.includes('2'));
		assert.equal(enumerations.length, v.dim);
	});
});

suite('extensibility', function (){
	var vec3;

	setup(function (){
		vec3 = vec.newVecType(3);
	});

	test('should allow modification of indices', function (){
		var v = new vec3(1, 2, 3);
		v[1] = 5;
		assert.deepEqual(v, new vec3(1, 5, 3));
	});
	test('should NOT allow changing of length', function (){
		var v = new vec3(1, 2, 3);
		v.length = 5;
		assert.equal(v.length, v.dim);
	});
	test('should NOT allow extensions', function (){
		var v = new vec3(1, 2, 3);
		v[100] = 0;
		v.someRandomProperty = 'no';
		assert(!('100' in v));
		assert(!('someRandomProperty' in v));
	});
});

suite('fallbacks for incompatible methods', function (){
	var vec3;

	setup(function (){
		vec3 = vec.newVecType(3);
	});

	test('should stay vec if map maps to all numbers', function (){
		var v = new vec3(1, 2, 3);
		var result = v.map((n) => Math.sqrt(n));
		assert(vec.isVec(result));
	});
	test('should NOT stay vec if map maps to non-numbers', function (){
		var v = new vec3(1, 2, 3);
		var result = v.map((n) => n > 0);
		assert(!vec.isVec(result));
	});
	test('should NOT stay vec when calling concat', function (){
		var v = new vec3(1, 2, 3);
		var result = v.concat(v);
		assert(!vec.isVec(result));
	});
});

suite('illegal methods', function (){
	var vec3;
	var v;

	setup(function (){
		vec3 = vec.newVecType(3);
		v = new vec3(1, 2, 3);
	});

	test('should disallow direct calls to push', function (){
		assert(v.push === undefined);
	});
	test('should disallow direct calls to pop', function (){
		assert(v.pop === undefined);
	});
	test('should disallow direct calls to shift', function (){
		assert(v.shift === undefined);
	});
	test('should disallow direct calls to unshift', function (){
		assert(v.unshift === undefined);
	});
});
