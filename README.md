# vecn

> A module for creating n-dimensional vector types that support swizzling.

[![Build Status](https://travis-ci.org/Zunawe/vecn.svg?branch=master)](https://travis-ci.org/Zunawe/vecn) [![Coverage Status](https://coveralls.io/repos/github/Zunawe/vecn/badge.svg?branch=master)](https://coveralls.io/github/Zunawe/vecn?branch=master)

Allows for the creation of vectors of arbitrary dimension that are also JavaScript `Arrays`. These arrays are fixed-length and accept only numbers as input, though they generally decay gracefully into regular `Arrays`. For example, you're allowed to use `map`, `reduce`, `concat`, and other `Array` methods, and if the result is a valid `vec`, a `vec` will be returned. Otherwise, you'll get back a standard `Array` with the new elements. These are specifically overloaded methods, so experimental, custom, and rebound methods aren't guaranteed to work.

## Install

```
$ npm install vecn
```

## Usage

Since they're the most common, `vec2`, `vec3`, and `vec4` are already included:
```js
const {vec3} = require('vecn');

let v = new vec3(1, 2, 3);
console.log(v);
```

```
vec3 [ 1, 2, 3 ]
```

If you need to create your own vector type:
```js
const vecn = require('vecn');

const vec5 = vecn.newVecType(5);
var v = new vec5(1, 2, 3, 4, 5);
console.log(v);
```

```
vec5 [ 1, 2, 3, 4, 5 ]
```

#### Swizzling

Swizzling is a technique used in GLSL that allows you to access a vector's components by name and build new vectors from them. It works the same here at arbitrary length. It's easiest to see in an example:

```js
var v = new vec4(1, 2, 3, 4);

v.x                          // 1
v.y                          // 2
v.z                          // 3
v.w                          // 4

v.xx                         // vec2 [ 1, 1 ]
v.zy                         // vec2 [ 3, 2 ]
v.zywwxyyz                   // vec8 [ 3, 2, 4, 4, 1, 2, 2, 3 ]
```

Swizzling only works for `vec2`, `vec3`, and `vec4`.

#### Important Nuance

When creating a new vecType, you are generating a new class. This class, however, is hidden behind a function that creates the object for you and returns a Proxy. Therefore, the function returned by `vecn.newVecType` is **not** a constructor. Since the `new` keyword implies a `return this` at the end of the function, but the function already returns, the existence of a `new` before the function call has no effect. The following code explains the importance:

```js
const vec2 = vecn.newVecType(2);

var v1 = new vec2(1, 2);     // Valid construction
var v2 = vec2(1, 2);         // Also valid

v1.constructor === vec2;     // False

```

Basically this allows for swizzling and lets me extend `Array` without letting the user mess with the length.
