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
    var v = new vec3(1, 2, 3);
    v[100] = 0;
    v.someRandomProperty = 'no';
    assert(!('100' in v));
    assert(!('someRandomProperty' in v));
  });
});

suite('illegal methods', function (){
  var v;

  setup(function (){
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
