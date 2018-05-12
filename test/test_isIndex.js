const assert = require('assert');
const {isIndex} = require('../index.js');

console.log('test_isIndex.js');

assert(isIndex('0'));
assert(isIndex('1'));
assert(isIndex('100'));

assert(!isIndex('-1'));
assert(!isIndex('1.1'));
assert(!isIndex('1.1'));
assert(!isIndex(''));
assert(!isIndex(' '));
assert(!isIndex('1e3'));
assert(!isIndex('-0'));
assert(!isIndex('a'));
assert(!isIndex('undefined'));
assert(!isIndex(0));
assert(!isIndex(1));
assert(!isIndex(1.1));
assert(!isIndex(false));
assert(!isIndex(undefined));
assert(!isIndex(null));
assert(!isIndex(assert));

console.log('Done!');
