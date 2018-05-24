const assert = require('assert');
const vecn = require('../src/index.js');

const {vec3} = vecn;

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

suite('indices', function (){
  test('should allow elements to be modified through indices', function (){
    var v = vec3(-1, 0, 1);
    assert.doesNotThrow(() => v[0] = 5);
    assert.deepEqual(v, vec3(5, 0, 1));
  });

  test('should NOT allow elements to be set to non-numbers', function (){
    var v = vec3(-1, 0, 1);
    assert.throws(() => v[0] = true, TypeError);
    assert.throws(() => v[0] = undefined, TypeError);
    assert.throws(() => v[0] = null, TypeError);
    assert.throws(() => v[0] = vec3, TypeError);
    assert.throws(() => v[0] = {}, TypeError);
    assert.throws(() => v[0] = 'string', TypeError);
  });
});

suite('extensibility', function (){
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
  
  test('should NOT allow changing of magnitude', function (){
    var v = new vec3(1, 2, 3);
    v.magnitude = 5;
    assert.equal(v.magnitude, Math.sqrt(1 + 4 + 9));
  });

  test('should NOT allow extensions', function (){
    var v = vec3(1, 2, 3);
    v.someRandomProperty = 'no';
    assert.throws(() => v[100] = 0, RangeError);
    assert(!('someRandomProperty' in v));
  });
});
