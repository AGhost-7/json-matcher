/* jshint esversion: 6 */

const Benchmark = require('benchmark');
const lib = require('./index');
const patrun = require('patrun');
const patMat = require('pat-mat');
const bloomrun = require('bloomrun');
const assert = require('assert');

const complex = {
	c: 1,
	d: 2,
	e: {
		f: {
			g: {
				h: 3,
				i: 4,
				k: 5
			}
		}
	}
};

const patterns = [
	{ a: 1, b: 2 }, 1,
	{ a: 1 }, 2,
	{ b: 2 }, 3,
	{
		c: 1,
		d: 2,
		e: {
			f: {
				g: {
					h: 1,
					i: 2
				}
			}
		},
		l: 1
	}, 4,
	complex, 5
];

const reduceTuples = (tpl, fn, init) => {
	var accu = init;
	for(var i = 0; i < tpl.length; i += 2) {
		accu = fn(accu, tpl[i], tpl[i + 1]);
	}
	return accu;
};

const p = reduceTuples(patterns, (accu, pat, val) => {
	accu.add(pat, val);
	return accu;
}, patrun());

assert(p.find(complex) === 5, 'patrun');

assert(lib.eager(patterns, complex) === 5, 'lib.eager');

const patmatArr = reduceTuples(patterns, (accu, pat, val) => {
	return accu.concat(patMat.Is(pat, () => val));
}, []);

const patmat = patMat.Match.apply(patMat.Match, patmatArr);

assert(patmat(complex) === 5, 'pat-mat');

const run = reduceTuples(patterns, (accu, pat, val) => {
	accu.add(pat, val);
	return accu;
}, bloomrun());

assert(run.lookup(complex) === 5, 'bloomrun');

const suite = new Benchmark.Suite();

suite
	.add('lib.eager', () => {
		lib.eager(patterns, complex);
	})
	.add('patrun', () => {
		p.find(complex);
	})
	.add('bloomrun', () => {
		run.lookup(complex);
	})
	.add('pat-mat', () => {
		patmat(complex);
	})
	.on('cycle', (event) => {
		console.log(String(event.target));
	})
	.on('complete', function() {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	})
	.run({ async: true });

