const assert = require('assert');
const {newVecType} = require('../index.js');

suite('arithmetic', function (){
	var vec3;
	var v1, v2;
	var v3;

	setup(function (){
		vec3 = newVecType(3);
		v1 = new vec3(1, 2, 3);
		v2 = new vec3(-0.1, 0.2, -0.3);

		vec2 = newVecType(2);
		v3 = new vec2(10, 20);
	});

	suite('neg', function (){
		test('should NOT mutate original vector', function (){
			var copy = new vec3(v1);
			v1.neg();
			assert.deepEqual(v1, copy);
		});
		test('should negate a vec', function (){
			assert.deepEqual(v1.neg(), new vec3(-1, -2, -3));
		});
	});

	suite('plus', function (){
		test('should NOT mutate original vectors', function (){
			var copy1 = new vec3(v1);
			var copy2 = new vec3(v2);
			v1.plus(v2);
			assert.deepEqual(v1, copy1);
			assert.deepEqual(v2, copy2);
		});
		test('should add two vecs', function (){
			assert.deepEqual(v1.plus(v2), new vec3(0.9, 2.2, 2.7));
		});
		test('should add scalar to vec', function (){
			assert.deepEqual(v1.plus(5), new vec3(6, 7, 8));
		});
		test('should NOT add vecs of different dimensions', function (){
			assert.throws(() => v1.plus(v3), Error);
			assert.throws(() => v3.plus(v1), Error);
		});
	});

	suite('minus', function (){
		test('should NOT mutate original vectors', function (){
			var copy1 = new vec3(v1);
			var copy2 = new vec3(v2);
			v1.minus(v2);
			assert.deepEqual(v1, copy1);
			assert.deepEqual(v2, copy2);
		});
		test('should subtract two vecs', function (){
			assert.deepEqual(v1.minus(v2), new vec3(1.1, 1.8, 3.3));
		});
		test('should subtract scalar from vec', function (){
			assert.deepEqual(v1.minus(3), new vec3(-2, -1, 0));
		});
		test('should NOT subtract vecs of different dimensions', function (){
			assert.throws(() => v1.minus(v3), Error);
			assert.throws(() => v3.minus(v1), Error);
		});
	});

	suite('times', function (){
		test('should NOT mutate original vectors', function (){
			var copy1 = new vec3(v1);
			var copy2 = new vec3(v2);
			v1.times(v2);
			assert.deepEqual(v1, copy1);
			assert.deepEqual(v2, copy2);
		});
		test('should component-wise multiply two vecs', function (){
			assert.deepEqual(v1.times(v2), new vec3(1 * -0.1, 2 * 0.2, 3 * -0.3));
		});
		test('should scale vec by scalar', function (){
			assert.deepEqual(v1.times(2), new vec3(2, 4, 6));
		});
		test('should NOT multiply vecs of different dimensions', function (){
			assert.throws(() => v1.times(v3), Error);
			assert.throws(() => v3.times(v1), Error);
		});
	});

	suite('div', function (){
		test('should NOT mutate original vectors', function (){
			var copy1 = new vec3(v1);
			var copy2 = new vec3(v2);
			v1.div(v2);
			assert.deepEqual(v1, copy1);
			assert.deepEqual(v2, copy2);
		});
		test('should component-wise divide two vecs', function (){
			assert.deepEqual(v1.div(v2), new vec3(1 / -0.1, 2 / 0.2, 3 / -0.3));
		});
		test('should scale vec by scalar', function (){
			assert.deepEqual(v1.div(2), new vec3(1 / 2, 2 / 2, 3 / 2));
		});
		test('should NOT divide vecs of different dimensions', function (){
			assert.throws(() => v1.div(v3), Error);
			assert.throws(() => v3.div(v1), Error);
		});
	});

	suite('pow', function (){
		test('should NOT mutate original vector', function (){
			var copy = new vec3(v1);
			v1.pow(2);
			assert.deepEqual(v1, copy);
		});
		test('should raise each component by a scalar exponent', function (){
			assert.deepEqual(v1.pow(2), new vec3(1, 4, 9));
		});
	});
});
