const assert = require('assert');

class vecn extends Array{
	constructor(dimension, args){
		assert(args.every((x) => typeof(x) === 'number'), 'All arguments must be numbers.');
		assert(args.length === 0 || args.length === 1 || args.length === dimension,
			'Argument list must be empty, have a single number, or have a length equal to the dimension.');

		if(args.length === 0){
			args = [0];
		}
		if(args.length === 1){
			args = [...Array(dimension)].map((x) => args[0]);
		}

		super(...args);
	}

	get magnitude(){
		return Math.sqrt(this.pow(2).sum());
	}

	neg(){
		return this.times(-1);
	}

	plus(v){
		assert(v instanceof this.constructor || typeof(v) === 'number', 'Argument must be a scalar or of this vecType.');
		if(typeof(v) === 'number'){
			v = new this.constructor(v);
		}
		return this.map((x, i) => x + v[i]);
	}

	minus(v){
		assert(v instanceof this.constructor || typeof(v) === 'number', 'Argument must be a scalar or of this vecType.');
		if(typeof(v) === 'number'){
			v = new this.constructor(v);
		}
		return this.plus(v.neg());
	}

	times(v){
		assert(v instanceof this.constructor || typeof(v) === 'number', 'Argument must be a scalar or of this vecType.');
		if(typeof(v) === 'number'){
			v = new this.constructor(v);
		}
		return this.map((x, i) => x * v[i]);
	}

	div(v){
		assert(v instanceof this.constructor || typeof(v) === 'number', 'Argument must be a scalar or of this vecType.');
		if(typeof(v) === 'number'){
			v = new this.constructor(v);
		}
		return this.times(v.pow(-1));
	}

	pow(p){
		return this.map((x) => Math.pow(x, p));
	}

	dot(v){
		assert(v instanceof this.constructor);
		assert(v.constructor === this.constructor, 'Argument must be of the same vecType.');
		return this.reduce((acc, x, i) => acc + (x * v[i]), 0);
	}

	sum(){
		return this.reduce((acc, n) => acc + n, 0);
	}

	normalize(){
		return this.div(this.magnitude);
	}

	concat(...values){
		return super.concat(...values).toArray();
	}

	filter(callbackfn){
		return super.filter(callbackfn).toArray();
	}

	map(callbackfn){
		var result = super.map(callbackfn);
		if(result.every((n) => typeof(n) === 'number')){
			return result;
		}
		return result.toArray();
	}

	slice(...args){
		return super.slice(...args).toArray();
	}

	splice(...args){
		return super.splice(...args).toArray();
	}

	toArray(){
		return Array.from(this);
	}
}

const namedIndices = {
	x: 0,
	y: 1,
	z: 2,
	w: 3
};
function swizzle(v, s){
	var dim = v.dim;
	var newDim = s.length;

	if(newDim === 1){
		return v[namedIndices[s]];
	}

	var vecType = newVecType(newDim);

	var values = s.split('').reduce((acc, x) => {
		var i = namedIndices[x];
		return acc && i < v.dim ? acc.concat([v[i]]) : undefined;
	}, []);
	return values ? new vecType(...values) : values;
}

function newVecType(dimension){
	assert(!isNaN(Number(dimension)), 'dimension must be coercible to a number.');
	assert(Number(dimension) > 1, 'dimension must be greater than 1.');
	assert(Number.isInteger(Number(dimension)), 'dimension must be an integer.');

	// Doing a little big of exploiting ES6 to dynamically name the class
	var classname = 'vec' + dimension;
	var temp = {
		[classname]: class extends vecn{
			constructor(...args){
				if(args.length === 1 && args[0] instanceof vecn){
					assert(args[0].dim <= dimension);
					args = promoteArrayDimension(args[0].toArray(), dimension);
				}
				super(dimension, args);
				Object.defineProperty(this, 'dim', {
					value: dimension,
					writable: false,
					enumerable: false
				});
			}
		}
	};

	var bannedFunctions = ['pop', 'push', 'shift', 'unshift'];

	return (function (...args){
		var target = new temp[classname](...args);
		var validator = {
			set: function (obj, prop, value){
				if(prop === 'length' || prop === 'magnitude'){
					return false;
				}

				obj[prop] = value;
				return true;
			},
			get: function (obj, prop){
				if(bannedFunctions.includes(prop)){
					return undefined;
				}
				if(obj.dim < 5 && prop.toString().split('').every((c) => c in namedIndices)){
					return swizzle(obj, prop);
				}

				return obj[prop];
			}
		};

		Object.preventExtensions(target);

		return new Proxy(target, validator);
	});
}

function isVec(v){
	return v instanceof vecn;
}

function isIndex(n){
	return !isNaN(n) &&
	       Number(n).toString() === n &&
		     Number.isInteger(Number(n)) &&
		     Number(n) >= 0;
}

function promoteArrayDimension(arr, dim){
	return [...Array(dim)].map((_, i) => i < arr.length ? arr[i] : 0);
}

function swizzle(v, s){
	const lookup = {
		x: 0,
		y: 1,
		z: 2,
		w: 3
	};
	var dim = v.dim;
	var newDim = s.length;

	if(newDim === 1){
		return v[lookup[s]];
	}

	var vecType = newVecType(newDim);

	var values = s.split('').reduce((acc, x) => {
		var i = lookup[x];
		return acc && i < v.dim ? acc.concat([v[i]]) : undefined;
	}, []);
	return values ? new vecType(...values) : values;
}

const vec2 = newVecType(2);
const vec3 = newVecType(3);
const vec4 = newVecType(4);

module.exports = {newVecType, isVec, vec2, vec3, vec4}
