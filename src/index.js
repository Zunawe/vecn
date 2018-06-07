/**
 * An object for memoizing vecType functions.
 * @type {Object}
 * @private
 */
let vecTypes = (function () {
  const handler = {
    get: function (obj, prop) {
      if (!obj.hasOwnProperty(prop)) {
        obj[prop] = getVecType(prop)
      }
      return obj[prop]
    }
  }

  return new Proxy({}, handler)
})()

/**
 * A class for fixed-size vectors of numbers.
 * @extends Array
 */
class vecn extends Array {
  /**
   * Creates a vecn of the specified dimension. This should never be called
   * by the user (as if this were an abstract class).
   * @param {number} dimension The dimension of this vector.
   * @param {number[]} [args=[]] The numbers to be put in the vector.
   */
  constructor (dimension, args) {
    args = flattenOuter(args)

    if (!args.every((x) => type(x) === 'Number')) {
      throw new TypeError('All arguments must be numbers.')
    }
    if (args.length > 1 && args.length !== dimension) {
      throw new Error('Argument list must be empty, have a single number, or have a length equal to the dimension.')
    }

    if (args.length === 0) {
      args = [0]
    }
    if (args.length === 1 && type(args[0]) === 'Number') {
      args = Array(dimension).fill(args[0])
    }

    if (dimension > 1) {
      super(...args)
    } else {
      super(1)
      this[0] = args[0]
    }

    Object.defineProperties(this, {
      pop: {
        value: undefined,
        enumerable: false
      },
      push: {
        value: undefined,
        enumerable: false
      },
      shift: {
        value: undefined,
        enumerable: false
      },
      unshift: {
        value: undefined,
        enumerable: false
      }
    })
  }

  /**
   * The L2 norm (Euclidian norm) of the vector.
   * @type {number}
   */
  get magnitude () {
    return this.pnorm(2)
  }

  // --------------------------------------------------------------------------
  //   Arithmetic

  /**
   * Returns a vector where this is divided by v componentwise. If v is
   * a single number, the vector is scaled by 1/v.
   * @param {number|number[]} v The value to multiply with.
   *
   * @returns {vecn} A new vector with the divided components.
   */
  div (v) {
    checkCompatibility(v, this.dim, true)
    if (type(v) === 'Number') {
      v = Array(this.dim).fill(v)
    }
    return vecTypes[this.dim](this.pow(-1).times(v).pow(-1))
  }

  /**
   * Returns a vector where v is subtracted from the components of this
   * vector. If v is a single number, it is subtracted to each component. If v
   * is a vector, the vectors are combined componentwise.
   * @param {number|number[]} v The value to subtract from this vector.
   *
   * @returns {vecn} A new vector with the combined components.
   */
  minus (v) {
    checkCompatibility(v, this.dim, true)
    if (type(v) === 'Number') {
      v = Array(this.dim).fill(v)
    }
    return vecTypes[this.dim](this.neg().plus(v).neg())
  }

  /**
   * Negates each element in this vector.
   * @returns {vecn} A new vector where all elements are negated.
   */
  neg () {
    return vecTypes[this.dim](this.times(-1))
  }

  /**
   * Returns a vector where v is added to the components of this vector. If v
   * is a single number, it is added to each component. If v is a vector, the
   * vectors are added componentwise.
   * @param {number|number[]} v The value to add to this vector.
   *
   * @returns {vecn} A new vector with the summed components.
   */
  plus (v) {
    checkCompatibility(v, this.dim, true)
    if (type(v) === 'Number') {
      v = Array(this.dim).fill(v)
    }
    return vecTypes[this.dim](this.map((x, i) => x + v[i]))
  }

  /**
   * Returns a vector where each component of this was raised to a power p.
   * @param {number} p The power to raise each component by.
   *
   * @returns {vecn} A new vector with the exponentiated components.
   */
  pow (p) {
    return vecTypes[this.dim](this.map((x) => Math.pow(x, p)))
  }

  /**
   * Returns a vector where v and this are multiplied componentwise. If v is
   * a single number, the vector is scaled by v.
   * @param {number|number[]} v The value to multiply with.
   *
   * @returns {vecn} A new vector with the multiplied components.
   */
  times (v) {
    checkCompatibility(v, this.dim, true)
    if (type(v) === 'Number') {
      v = Array(this.dim).fill(v)
    }
    return vecTypes[this.dim](this.map((x, i) => x * v[i]))
  }

  // --------------------------------------------------------------------------
  //   Vector Operations

  /**
   * Dot product of two vectors.
   * @param {number[]} v The vector to dot with this one.
   *
   * @returns {number} The dot product between this and v.
   */
  dot (v) {
    checkCompatibility(v, this.dim)
    return this.reduce((acc, x, i) => acc + (x * v[i]), 0)
  }

  /**
   * Scales this vector to a magnitude of 1.
   *
   * @returns {vecn} A new vector with scaled components.
   */
  normalize () {
    return vecTypes[this.dim](this.div(this.magnitude))
  }

  /**
   * Evaluates the p-norm (or lp-norm) of this vector.
   * @param {number} p The p-value to evaluate.
   *
   * @returns {number} The norm of this vector.
   */
  pnorm (p) {
    return Math.pow(this.map(Math.abs).pow(p).sum(), 1 / p)
  }

  /**
   * Reflects this vector across the provided vector. The normal can be imagined
   * as a surface normal or as describing a hyperpalane.
   * @param {number[]} normal A vector describing the hyperplane to reflect off of.
   *
   * @returns {vecn} The reflected vector.
   */
  reflect (normal) {
    const n = normal.normalize()
    return this.minus(n.times(2 * this.dot(n)))
  }

  // --------------------------------------------------------------------------
  //   Extras

  /**
   * Finds the indices of the max value in this vector.
   *
   * @returns {number[]} An array of indices corresponding to the max values.
   */
  argmax () {
    const maxVal = this.max()
    return this.reduce((acc, x, i) => x === maxVal ? acc.concat([i]) : acc, [])
  }

  /**
   * Finds the indices of the min value in this vector.
   *
   * @returns {number[]} An array of indices corresponding to the min values.
   */
  argmin () {
    const minVal = this.min()
    return this.reduce((acc, x, i) => x === minVal ? acc.concat([i]) : acc, [])
  }

  /**
   * Creates a new vector from the provided indices of this one. Basically
   * equivalent to swizzling.
   * @param {number[]} indices The indices to select into a new vector.
   *
   * @returns {vecn} A new vector from the provided indices.
   */
  choose (indices) {
    if (!Array.isArray(indices)) {
      throw new TypeError('Argument must be a list of indices.')
    }
    if (!indices.every((i) => i < this.dim && isIndex(i.toString()))) {
      throw new RangeError('All elements of argument must be valid indices.')
    }

    let v = []
    indices.forEach((i) => v.push(this[i]))
    return vecTypes[v.length](v)
  }

  /**
   * Returns whether every element in each vector is equal.
   * @param {number[]} v A vector to test against.
   *
   * @returns {boolean} True if both vectors have the same dimension and values.
   */
  equals (v) {
    return v.length === this.dim && v.every((x, i) => this[i] === x)
  }

  /**
   * Returns whether every element in each vector is approximately equal.
   * @param {number[]} v A vector to test against.
   * @param {number} epsilon The largest meaningful difference between two values.
   *
   * @returns {boolean} True if both vectors have the same dimension and the
   * distance between each number is less than epsilon.
   */
  approximatelyEquals (v, epsilon = 0.00000001) {
    return v.length === this.dim && v.every((x, i) => Math.abs(this[i] - x) < epsilon)
  }

  /**
   * Returns the max value of this vector.
   *
   * @returns {number} The max value of this vector.
   */
  max () {
    return Math.max(...this)
  }

  /**
   * Returns the min value of this vector.
   *
   * @returns {number} The min value of this vector.
   */
  min () {
    return Math.min(...this)
  }

  /**
   * Sums the components of this vector.
   *
   * @returns {number} The sum of the components of this vector.
   */
  sum () {
    return this.reduce((acc, x) => acc + x, 0)
  }

  /**
   * Converts this vector into an Array.
   *
   * @returns {number[]} An array of the contents of this vector.
   */
  toArray () {
    return Array.from(this)
  }

  // --------------------------------------------------------------------------
  //   Array Overrides

  /**
   * Same as Array.prototype.concat, but return value is of a new vecType.
   *
   * @returns {vecn}
   */
  concat (...args) {
    const result = super.concat.apply(this.toArray(), args)
    return vecTypes[result.length](result)
  }

  /**
   * Same as Array.prototype.filter, but returns an Array if the result has 0
   * entries.
   *
   * @returns {vecn|number[]}
   */
  filter (...args) {
    const result = super.filter.apply(this.toArray(), args)
    if (result.length > 0) {
      return vecTypes[result.length](result)
    }
    return result
  }

  /**
   * Same as Array.prototype.map, but returns an Array if the result contains
   * non-numbers.
   *
   * @returns {vecn|Array}
   */
  map (...args) {
    const result = super.map(...args)
    if (result.every((x) => type(x) === 'Number')) {
      return result
    }
    return result.toArray()
  }

  /**
   * Same as Array.prototype.slice, but returns an Array if the result has 0
   * entries.
   */
  slice (...args) {
    const result = super.slice.apply(this.toArray(), args)
    if (result.length > 0) {
      return vecTypes[result.length](result)
    }
    return result
  }

  /**
   * A restrictive version of the Array.prototype.splice that requires all
   * removed elements to be replaced.
   */
  splice (...args) {
    let test = this.toArray()
    test.splice(...args)

    if (test.length !== this.dim) {
      throw new Error('All removed elements must be replaced.')
    }
    if (!test.every((x) => type(x) === 'Number')) {
      throw new TypeError('All elements must be numbers.')
    }

    test.forEach((x, i) => { this[i] = x })
  }

  toString () {
    return this.reduce((s, x, i) => {
      return s + x + (i === this.dim - 1 ? ' ' : ', ')
    }, '[ ') + ']'
  }
}

// --------------------------------------------------------------------------
//   General Tools

/**
 * Adds an arbitrary number of vectors together. All vectors must be of the same
 * dimension.
 * @param {...vecn} vecs Vectors to add together.
 *
 * @returns {vecn} The sum of all the provided vectors.
 */
function add (...vecs) {
  const dim = vecs[0].dim
  if (!vecs.every((v) => v.dim === dim)) {
    throw new TypeError('All vectors must have the same dimension.')
  }
  return vecs.reduce((acc, v) => acc.plus(v), vecTypes[dim]())
}

/**
 * The validator to be used in the proxy for all vec objects. Catches swizzling
 * properties, makes sure assignment only works for indices, and disallows
 * non-numerical assignments. Used in `getVecType`.
 * @type {Object}
 * @private
 */
let validator = {
  set: function (obj, prop, value) {
    if (prop === 'length') {
      return false
    }
    if (isIndex(prop)) {
      if (Number(prop) >= obj.dim) {
        throw new RangeError('Vector may not have more elements than dimension.')
      } else if (type(value) !== 'Number') {
        throw new TypeError('Vectors may only contain numbers.')
      } else {
        obj[prop] = value
        return true
      }
    }

    const swizzleSymbolSet = getSwizzleSymbolSet(prop.toString())
    if (obj.dim <= 4 && swizzleSymbolSet) {
      swizzleSet(obj, prop.toString(), swizzleSymbolSet, value)
      return true
    }

    return false
  },
  get: function (obj, prop) {
    const swizzleSymbolSet = getSwizzleSymbolSet(prop.toString())
    if (obj.dim <= 4 && swizzleSymbolSet) {
      return swizzleGet(obj, prop, swizzleSymbolSet)
    }

    return obj[prop]
  }
}

/**
 * Returns a factory function for vectors of the specified dimension.
 * @param {number} dim The dimension of the new vector type.
 *
 * @returns {getVecType~factory} A factory (not a constructor) for creating new vecs.
 */
function getVecType (dim) {
  dim = Number(dim)

  if (!(dim in vecTypes)) {
    if (isNaN(dim)) throw new TypeError('Dimension must be coercible to a number.')
    if (dim <= 0) throw new RangeError('Dimension must be positive.')
    if (!Number.isInteger(dim)) throw new RangeError('Dimension must be positive.')

    // Doing a little bit of exploiting ES6 to dynamically name the class
    let classname = 'vec' + dim
    let VecType = ({[classname]: class extends vecn {
      constructor (...args) {
        if (args.length === 1 && args[0] instanceof vecn) {
          if (args[0].dim > dim) {
            throw new TypeError('Cannot demote vectors.')
          }
          args = promoteArrayDimension(args[0].toArray(), dim)
        }
        super(dim, args)
        Object.defineProperty(this, 'dim', {
          value: dim,
          writable: false,
          enumerable: false
        })
      }
    }})[classname]

    let factory = function factory (...args) {
      let target = new VecType(...args)
      Object.preventExtensions(target)
      return new Proxy(target, validator)
    }
    vecTypes[dim] = factory
  }

  return vecTypes[dim]
}

/**
 * The correct function for determining whether an object is a vecn.
 * @param {*} v The object in question.
 *
 * @returns {boolean} True if the object is an instance of vecn.
 */
function isVec (v) {
  return v instanceof vecn
}

/**
 * Linearly interpolates between two vectors.
 * @param {vecn} v1 The starting vector.
 * @param {vecn} v2 The ending vector.
 * @param {number} t The interpolant, which is clamped to the inteval [0, 1].
 *
 * @returns {vecn} The interpolated vector.
 */
function lerp (v1, v2, t) {
  if (v1.dim !== v2.dim) throw new TypeError('Vectors must have the same dimension.')
  t = t < 0 ? 0 : (t > 1 ? 1 : t)
  return v1.plus(v2.minus(v1).times(t))
}

/**
 * Multiplies an arbitrary number of vectors together. All vectors must be of the same
 * dimension.
 * @param {...vecn} vecs Vectors to multiply together.
 *
 * @returns {vecn} The product of all the provided vectors.
 */
function multiply (...vecs) {
  const dim = vecs[0].dim
  if (!vecs.every((v) => v.dim === dim)) throw new TypeError('All vectors must have the same dimension.')
  return vecs.reduce((acc, v) => acc.times(v), vecTypes[dim](1))
}

/**
 * Spherically interpolates between two vectors.
 * @param {vecn} v1 The starting vector.
 * @param {vecn} v2 The ending vector.
 * @param {number} t The interpolant, which is clamped to the inteval [0, 1].
 *
 * @returns {vecn} The interpolated vector.
 */
function slerp (v1, v2, t) {
  if (v1.dim !== v2.dim) throw new TypeError('Vectors must have the same dimension.')

  t = t < 0 ? 0 : (t > 1 ? 1 : t)
  let dot = v1.normalize().dot(v2.normalize())
  dot = dot < -1 ? -1 : (dot > 1 ? 1 : dot)
  const theta = Math.acos(dot) * t
  const relative = v2.minus(v1.times(dot)).normalize()
  const magnitude = v1.magnitude + ((v2.magnitude - v1.magnitude) * t)
  return v1.times(Math.cos(theta)).plus(relative.times(Math.sin(theta)))
    .normalize().times(magnitude)
}

// --------------------------------------------------------------------------
//   Swizzling

/**
 * The index corresponding to common names for indexing vectors.
 * @constant
 * @type {Object}
 * @private
 */
const namedIndices = [
  {x: 0, y: 1, z: 2, w: 3},
  {r: 0, g: 1, b: 2, a: 3},
  {s: 0, t: 1, p: 2, q: 3}
]

/**
 * Gets the set of symbols corresponding to indices used for swizzling.
 * @private
 * @param {string} s The string used as a property to swizzle.
 *
 * @returns {Object} A map from characters to indices.
 */
function getSwizzleSymbolSet (s) {
  return namedIndices.find((set) => {
    return s.split('').every((c) => c in set)
  })
}

/**
 * Creates a new vector from the named indices given by swizzling.
 * @private
 * @param {vecn} v The vector to pull data from. The dimension is assumed to be
 * 2, 3, or 4, but this isn't enforced here.
 * @param {string} s The property being used to swizzle (e.g. 'xxy' or 'z').
 * @param {Object} set A map from characters to indices (assumed to be valid).
 *
 * @returns {undefined|number|vecn} Either undefined (if s isn't a valid swizzle
 * string), a number (if s has a length of 1), or a vecn where the values have
 * been rearranged according to the order given in s.
 */
function swizzleGet (v, s, set) {
  const newDim = s.length

  if (newDim === 1) {
    return v[set[s]]
  }

  var values = s.split('').reduce((acc, x) => {
    var i = set[x]
    return acc && i < v.dim ? acc.concat([v[i]]) : undefined
  }, [])
  return values ? new vecTypes[newDim](...values) : values
}

/**
 * Assigns the indexed values in v to the values in newVals in the order they
 * are described in in s.
 * @private
 * @param {vecn} v The starting vector.
 * @param {string} s The property being used to swizzle (e.g. 'xyz' or 'xz').
 * @param {Object} set A map from characters to indices (assumed to be valid).
 * @param {number|number[]} newVals The right hand side of the assignment
 *
 * @returns {vecn} A copy of v with the correct elements replaced.
 */
function swizzleSet (v, s, set, newVals) {
  if (s.length === 1) {
    if (type(newVals) !== 'Number') {
      throw new TypeError('Must set to a number')
    }
    v[set[s]] = newVals
    return
  }

  if (!Array.isArray(newVals)) throw new TypeError('Right-hand side must be an array.')
  if (s.length !== newVals.length) throw new TypeError('Right-hand side must have matching length.')
  if (!newVals.every((item) => type(item) === 'Number')) throw new TypeError('All new values must be numbers.')

  if (s.split('').some((c) => set[c] >= v.dim)) {
    return
  }

  let valid = true
  for (let i = 0, unique = {}; i < s.length; ++i) {
    if (unique.hasOwnProperty(s[i])) {
      valid = false
      break
    }
    unique[s[i]] = true
  }
  if (!valid) throw new SyntaxError('Swizzle assignment does not allow symbols to be repeated.')

  s.split('').map((c) => set[c]).forEach((index, i) => { v[index] = newVals[i] })
}

// --------------------------------------------------------------------------
//   Helpers

/**
 * Checks whether something is valid to do vector operations with and throws
 * a TypeError if not.
 * @private
 * @param {*} o An object to check.
 * @param {number} dim The dimension to check against.
 * @param {boolean} numberValid Whether scalars are compatible for the operation.
 */
function checkCompatibility (o, dim, numberValid = false) {
  if (numberValid && type(o) === 'Number') {
    return
  } else if (o.length && o.length === dim) {
    return
  }
  throw new TypeError(`Invalid argument. Input must have matching dimension ${numberValid ? 'or be a scalar' : ''}.`)
}

/**
 * Removes outer arrays and returns a reference to the innermost array. For
 * example, [[1, 2]] becomes [1, 2]. [[[['a'], true]]] becomes [['a'], true].
 * @private
 * @param {Array} arr The array to flatten.
 *
 * @returns {Array} A reference to the innermost array in arr.
 */
function flattenOuter (arr) {
  if (!(arr instanceof Array) || arr.length !== 1) {
    return arr
  }
  if (arr[0] instanceof Array) {
    return flattenOuter(arr[0])
  }
  return arr
}

/**
 * Checks whether a provided string can be used as a valid index into an array.
 * @private
 * @param {string} n A string representation of the number in question.
 *
 * @returns {boolean} True if n can be used to index an array.
 */
function isIndex (n) {
  return !isNaN(n) &&
         Number(n).toString() === n &&
         Number.isInteger(Number(n)) &&
         Number(n) >= 0
}

/**
 * Lengthens an exsting array and fills new entries with 0 (does not mutate).
 * @private
 * @param {Array} arr The source array.
 * @param {number} dim The dimension of the new array.
 *
 * @returns {Array} A new array with length dim and arr as a prefix.
 */
function promoteArrayDimension (arr, dim) {
  return [...Array(dim)].map((_, i) => i < arr.length ? arr[i] : 0)
}

/**
 * Returns a string representing the type of an object. Similar to typeof, but
 * better with wrapped primitives, null, Array, etc...
 * @private
 * @param {*} obj The object to check the type of.
 *
 * @returns {string} A capitalized string describing the perceived type (i.e. 'Number', 'Array', etc...)
 */
function type (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}

module.exports = {
  getVecType,
  isVec,
  vec2: vecTypes[2],
  vec3: vecTypes[3],
  vec4: vecTypes[4],

  add,
  multiply,
  lerp,
  slerp
}
