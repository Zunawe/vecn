const assert = require('assert');

class vec extends Array{
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
		v = new this.constructor(v);
		assert(v.constructor === this.constructor, 'Argument must be a promotable to this vecType.')
		return this.map((x, i) => x + v[i]);
	}

	minus(v){
		v = new this.constructor(v);
		assert(v.constructor === this.constructor, 'Argument must be a promotable to this vecType.')
		return this.plus(v.neg());
	}

	times(v){
		v = new this.constructor(v);
		assert(v.constructor === this.constructor, 'Argument must be a promotable to this vecType.')
		return this.map((x, i) => x * v[i]);
	}

	div(v){
		v = new this.constructor(v);
		assert(v.constructor === this.constructor, 'Argument must be a promotable to this vecType.')
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

	toArray(){
		return Array.from(this);
	}
}

function newVecType(dimension){
	return (
		class extends vec{
			constructor(...args){
				if(args.length === 1 && args[0] instanceof vec){
					assert(args[0].dim <= dimension);
					args = promoteArrayDimension(args[0].toArray(), dimension);
				}
				super(dimension, args);
				this.dim = dimension;
			}
		}
	);
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
module.exports = {newVecType, isIndex}

// Release
// module.exports = {newVecType};
