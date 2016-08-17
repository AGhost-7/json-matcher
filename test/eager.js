/* jshint esversion: 6 */
const test = require('ava');
const lib = require('../index');
const testMatch = require('./test-match');

testMatch((pattern) => {
	return (value) => lib.eager(pattern, value);
});

