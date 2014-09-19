
(function(window, undefined) {
	
	/**
	 * Understreg.js
	 *
	 * Implementation of most of Lodash utility functions.
	 */


	var slice = Array.prototype.slice,
		push = Array.prototype.push,
		toString = Object.prototype.toString,
		hasOwn = Object.prototype.hasOwnProperty;




	/**
	 * 
	 * Objects
	 *
	 */

	function has(object, property) {
		return object ? object.hasOwnProperty(property) : false;
	}

	function assign() {
	}

	function isObject(obj) {
		return 'object' === typeof obj;
	}

	function isPlainObject(obj) {
		return isObject(obj) && toString.call(obj) === '[object Object]';
	}

	function isString(str) {
		return 'string' === typeof str;
	}

	function isFunction(func) {
		return 'function' === typeof func;
	}


	/**
	 *
	 * Functions
	 *
	 */

	/**
	 * 
	 * Arrays
	 *
	 */

	function compact(array){
		if (!array.length) return array;

		var res = [], 
			i,
			len;

		for (i = 0, len = array.length; i < len; i++) {
			if (array[i]) {
				res.push(array[i]);
			}
		}

		return res;
	}

	function difference() {
		var args = toArray(arguments),
			array,
			arrays,
			i,
			len,
			// Resulting array of elements in 'array' not
			// present in any other arrays
			diff = [];

		if (args.length === 0) 
			return;

		if (args.length === 1) 
			return args[0];

		array = args[0];
		arrays = slice.call(args, 1);

		forEach(array, function(value) {
			forEach(arrays, function(arr) {
				if (indexOf(arr, value) === -1) {
					diff.push(value);
				}
			});
		});

		return diff;
	}

	function findIndex(array, callback, thisArg) {
		var i, len;
		for (i = 0, len = array.length; i < len; i++) {
			if (callback.call(thisArg, array[i]) === true) {
				return i;
			}
		}
	}

	function indexOf(array, value, fromIndex) {
		var i = 0, len = array.length;

		if (fromIndex && fromIndex !== true) {
			i = fromIndex;
		} else if (fromIndex === true) {
			// TODO binary search
		}

		for (; i < len; i++) {
			if (array[i] === value) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * Collections
	 */

	/**
	 * Iterates over the collection, executing the callback for each element
	 * in collection. The callback is bound to thisArg and is invoked with three
	 * arguments: (value, index|key, collection). Callbacks may exit iteration early
	 * by returning false.
	 * 
	 *
	 * @param {Array|Object|String} collection The collection to iterate over
	 * @param {Function} [callback] The function called per iteration
	 * @param {Mixed} [thisArg] The `this` binding of `callback` 
	 *
	 */
	function forEach(collection, callback, thisArg) {
		var index = -1,
			length = collection ? collection.length : 0;

		callback = callback && typeof thisArg == 'undefined' ? callback : createCallback(callback, thisArg);
		if (typeof length == 'number') {
			while (++index < length) {
				if (callback(collection[index], index, collection) === false) {
					break;
				}
			}
		} else {
			forOwn(collection, callback);
		}
		return collection;
	}

	function groupBy(collection, callback, thisArg) {
		var result = {},
			callback = createCallback(callback, thisArg);

		forEach(collection, function(value, key) {
			key = String(callback(value, key, collection));
			(has(collection, key) ? result[key] : (result[key] = [])).push(value);
		});
		return result;
	}

	/**
	 * Iterates over the `collection`, executing the `callback` for each element
	 * and collects the return value in a resulting array.
	 *
	 * @param {Array|Object|String} collection The collection to iterate over
	 * @param {Function} callback The function called per iteration
	 * @param {Mixed} thisArg This `this` binding of `callback`
	 *
	 */
	function map(collection, callback, thisArg) {
		var index = -1,
			length = collection ? collection.length : 0,
			result;

		if (typeof length == 'number') {
			result = [];
			while (++index < length) {
				result[index] = callback(collection[index], index, collection);
			}
		} else {
			result = [];
			forOwn(collection, function(value, key) {
				result[++index] = callback(value, key, collection);
			});
		}
		return result;
	}
	 
	/**
	 * Creates a new array of filtered elements. Iterates over each element in `collection` 
	 * executing `callback` with the arguments (value, index|key, collection).  
	 * If `callback` returns a truthy value, the value is pushed to the new array.
	 * 
	 * If a property name is passed for `callback` (string), elements with that property (and 
	 * truthy value) is pushed to the filtered array.
	 *
	 * If an object is passed for `callback`, elements with the properties of the object
	 * is pushed to the filtered array.
	 * 
	 * @param {Array|Object|String} collection The collection to filter
	 * @param {Function|Object|String} callback
	 * @param {Mixed} thisArg Value bound to `this` 
	 * @return {Array} New array with elements that passed the `callback` check
	 */
	function filter(collection, callback, thisArg) {
		var result = [],
			callback = createCallback(callback, thisArg);

		forEach(collection, function(value, key) {
			if (callback(value, key, collection)) {
				result.push(value);
			}
		});
		return result;
	}

	/**
	 * Iterates over `collection` plucking `property` from each element.
	 * 
	 * @param {Array} collection The array to iterate over
	 * @param {String} property The property to pluck
	 * @returns {Array} The plucked properties
	 */
	function pluck(collection, property) {
		var index = -1,
			result,
			length = collection ? collection.length : 0;

		if (typeof length == 'number') { // array or string
			result = new Array(length);
			while (++index < length) {
				result[index] = collection[index][property];
			}
		} 
		return result || map(collection, property);
	}

	function reduce(collection, callback, accumulator, thisArg) {		
		callback = createCallback(callback, thisArg);

		var index = -1,
			length = collection ? collection.length : 0,
			noaccumulator = arguments.length < 3;

		if (typeof length == 'number') {
			if (noaccumulator) {
				accumulator = collection[++index];
			}
			// array, string
			while (++index < length) {
				accumulator = callback(accumulator, collection[index], index, collection);
			}
		} else {
			// object
			forEach(collection, function(value, key) {
				if (noaccumulator) {
					accumulator = value;
					noaccumulator = false;
				} else {
					accumulator = callback(accumulator, value, key, collection);
				}
			});
		}
		return accumulator;
	}	

	/**
	 * 
	 * Utilities
	 *
	 */

	/**
	 * @param {Function|String|Object} fn 
	 */
	function createCallback(fn, thisArg) {
		if (fn == null) {
			return noop;
		}
		var type = typeof fn;
		if (type != 'function') {
			if (type != 'object') {
				// string
				return function(value) {
					return value[fn]; 
				}
			}
			// object
			return function(value, key, collection) {
				var prop, val;
				for (prop in fn) {
					if (hasOwn.call(fn, prop)) {
						if (fn[prop] != value[prop]) {
							return false;
						}
					}
				}
				return true;
			}
		}

		if (typeof thisArg == 'undefined') {
			return fn;
		}
		return function(value, index, collection) {
			return fn.call(thisArg, value, index, collection);
		}
	}

	function wrap(value, wrapper) {
		return function() {
			var args = [value];
			push.apply(args, arguments);
			return wrapper.apply(this, args);
		}
	}

	function noop(value) {
		return value;
	}

	function forOwn(obj, callback) {
		var key, value;
		for (key in obj) {
			if (hasOwn.call(obj, key)) {
				if (callback(obj[key], key, obj) === false) {
					break;
				}
			}
		}
	}

	function toArray(obj) {
		return slice.call(obj);
	}


	var _ = function() {};

	_.isObject = isObject;
	_.isString = isString;
	_.isFunction = isFunction;

	_.wrap = wrap;
	_.createCallback = createCallback;

	_.compact = compact;
	_.difference = difference;
	_.findIndex = findIndex;
	_.indexOf = indexOf;

	_.forEach = _.each = forEach;
	_.groupBy = groupBy;
	_.map = _.collect = map;
	_.filter = filter;
	_.pluck = pluck;
	_.reduce = reduce;


	// Keep reference to existing impl.
	var old_ = window._;

	window._ = _;


})(window);