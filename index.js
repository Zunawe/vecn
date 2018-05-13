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
		assert(v.constructor === this.constructor, 'Argument must be of the same vecType.')
		return this.reduce((acc, x, i) => acc + (x * v[i]), 0);
	}

	concat(...values){
		return super.concat(...values).toArray();
	}

	map(callbackfn){
		var result = super.map(callbackfn);
		if(result.every((n) => typeof(n) === 'number')){
			return result;
		}
		return result.toArray();
	}

	toArray(){
		return Array.from(this);
	}
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

	var bannedFunctions = [];

	return (function (...args){
		var target = new temp[classname](...args);
		var validator = {
			set: function (obj, prop, value){
				if(prop === 'length'){
					return false;
				}

				obj[prop] = value;
				return true;
			},
			get: function (obj, prop){
				if(bannedFunctions.includes(prop)){
					return undefined;
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

// Debug
module.exports = {newVecType, isVec}

// Release
// module.exports = {newVecType};
