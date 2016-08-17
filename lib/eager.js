/* jshint esversion: 6 */

const MatchNode = function(pattern, value, keys, index, tail) {
	this.pattern = pattern;
	this.value = value;
	this.keys = keys;
	this.index = index;
	this.tail = tail;
};

const MATCH_STRUCTURE = -1;
const MATCH_FALSE = 0;
const MATCH_TRUE = 1;

const isMatchOrStructure = (pattern, value) => {
	switch(typeof pattern) {
		case 'undefined':
		case 'number':
		case 'string':
		case 'boolean':
			if(pattern !== value) {
				return MATCH_FALSE;
			}
			return MATCH_TRUE;
		case 'object':
			if(pattern === null) {
				if(value !== null) return MATCH_FALSE;
				else return MATCH_TRUE;
			}
			return MATCH_STRUCTURE;
	}
};

const arrayKeys = (arr) => {
	const keys = new Int32Array(arr.length);
	var i = 0;
	while(i < arr.length) keys[i] = i++;
	return keys;
};

const createNode = (pattern, value, head) => {
	var keys;
	if(Array.isArray(pattern)) {
		if(!Array.isArray(value)) return null;

		// I need to pause this to process the next item. I can't make it call itself.
		// The simplest way would be to use the indexes as keys and make it a match node.
		keys = arrayKeys(pattern);
	} else {
		keys = Object.keys(pattern);
	}

	return new MatchNode(pattern, value, keys, 0, head);
};

// call stack optimized... I need to create an object anyways,
// so just use a linked list-like structure instead of an array 
// to make even more lightweight.
const structureMatch = (argPattern, argValue) => {
	var key, value, pattern, skipIncrement, newNode, head;
	head = createNode(argPattern, argValue, null);
	if(head === null) return false;

	nodeLoop:
	while(head !== null) {
		key = head.keys[head.index];
		while(head.index < head.keys.length) {
			pattern = head.pattern[key];
			value = head.value[key];
			switch(isMatchOrStructure(pattern, value)) {
				case MATCH_TRUE: break;
				case MATCH_FALSE: return false;
				case MATCH_STRUCTURE:
					newNode = createNode(pattern, value, head);
					if(newNode === null) {
						return false;
					}
					head.index++;
					head = newNode;
					continue nodeLoop;
			}
			head.index++;
			key = head.keys[head.index];
		}
		head = head.tail;
	}
	return true;
};

const isPatternMatch = (pattern, value) => {
	switch(isMatchOrStructure(pattern, value)) {
		case MATCH_STRUCTURE:
			return structureMatch(pattern, value);
		case MATCH_TRUE:
			return true;
		case MATCH_FALSE:
			return false;
	}
};

const match = (tuples, value) => {
	for(var i = 0; i < tuples.length; i += 2) {
		var pattern = tuples[i];
		var returnValue = tuples[i + 1];
		//console.log('eageMatch:', pattern, i, returnValue);
		if(isPatternMatch(pattern, value)) {
			return returnValue;
		}
	}
};

module.exports = match;
