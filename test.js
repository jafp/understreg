

// test.js


var food = [
    { 'name': 'apple',  'organic': false, 'type': 'fruit', weight: 10 },
    { 'name': 'carrot', 'organic': true,  'type': 'vegetable', weight: 15 },
    { name: 'wine gum', weight: 20 }
];

console.log(_.compact([0, 1, false, 2, '', 3]));

console.log(_.difference([1,2,3,4,5], [5,2,10]));

console.log(_.findIndex(['apple', 'banana', 'beet'], function(food) { 
	return /^b/.test(food);
}));

console.log(_.indexOf([1,2,3,1,2,3], 2, 3));


// forEach
_.forEach([1, 2, 3, 4], function(value, index, collection) { 
	console.log(value, index, collection); 
});
_.forEach({ one: 1, two: 2, three: 3}, function(value, key, collection) {
	console.log(arguments)
});

// groupBy
console.log(_.groupBy([4.2, 6.1, 6.4], function(value) {
	return this.floor(value);
}, Math));

console.log(_.map([1,2,3], function(n) { return n * n; }));
console.log(_.map(food[0], function(v) { return v + '1' }));

console.log(_.filter([1,2,3,4,5,6], function(n) {
	return n % 2 === 0;	
}));

console.log(_.pluck(food, 'name'));

console.log(_.filter(food, 'organic'));
console.log(_.filter(food, { 'type': 'fruit' }))

console.log('#reduce');
var sum = _.reduce([1, 2, 3], function(sum, num, idx, col) {
	return sum + num;
});
console.log('sum', sum);

var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key, col) {
	result[key] = num * 3;
	return result;
}, {});
console.log('mapped', mapped)


console.log('#wrap');
var hello = function(name) { return 'hello, ' + name };
hello = _.wrap(hello, function(func, name) {
	return 'before, ' + func(name) + ', after';
});
console.log('hello', hello("Jacob"));

var compare_int = _.wrap(_.createCallback, function(func, value, key, collection) {
	var match = /(.+) ([<>]) (.+)+/.exec(value);
	return !match ? func(value, key, collection) : function(value, key, collection) {
		return match[2] === '>' ? value[match[1]] > parseInt(match[3]) : value[match[1]] < parseInt(match[3]);
	}
});

	
console.log('foods weighing over 12', _.filter(food, compare_int('weight > 12')));

