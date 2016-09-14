// So how do I implement this monster?
//
// Focus is performance after it is compiled, so I think
// to reach this goal I should start with writing
// my reader instead of the tree generator.

/*

{
  action: EVERY | OBJECT | EQUAL
}

// example match set:

// decision tree (n.b., arrays can just be field lookups):

*/

const COMPARE = 0;
const WALK = 1;
const UNWALK = 2;
const RETURN = 3;
const UNDEFINED = 4;

const ObjectNode = (obj, tail) => {
	this.head = obj;
	this.tail = tail;
};

const read = (tree, argValue) => {
	var next = tree;
	var value = argValue;
	var objects = null;
	while(true) {
		switch(next.action) {
			case COMPARE:
				// would throw on field access, besides this means it isn't what we wanted.
				if(value === null || value === undefined) {
					next = next.ifFalse;
					break;
				}

				if(next.value === value[next.field]) {
					next = next.ifTrue;
				} else {
					next = next.ifFalse;
				}

				break;
			case WALK:
				objects = new ObjectNode(value, objects);
				if(value === null || value === undefined) {
					next = next.else;
					break;
				}
				value = value[next.field];
				next = next.else;
				break;
			case UNWALK:
				objects = objects.tail;
				next = next.then;
				break;
			case RETURN:
				return next.value;
			case UNDEFINED:
				return;
		}
	}
};

const objectKeys = (obj) {
	if(obj === undefined) return [];
	if(obj === null) return [];
	return Object.keys(obj);
};

// - I need to go through the first pattern... in its entirety.
// - If one condition fails I need to walk to the next property.
const generate = (patterns) => {
	const nodes = {};
	const tree = { action: UNDEFINED };
	return generate.nextPattern(patterns, 0, tree, false);
};

// Don't want to have duplicated equality checks...
generate.propChecked = (k, depth, propSet) => {
	var iter = propSet;
	for(var i = 0; i < depth.length; i++) {
		if(iter[depth[i]] === undefined) {
			return false;
		}
	}
	return iter[k] !== undefined;
};

generate.concatPropSet = (k, depth, propSet) => {
};

generate.focusProps = (k, patterns) => {
};

generate.unfocusProps = (depth, patterns) => {
};

generate.shouldUnfocus = {};

// focus is the subset of the patterns that I'm currently working on
// pi is the pattern index
// keys are the keys of the patterns I am focused on
// ki is the index of the keys.
// depth tracks where I am in the object
// propSet tracks properties that I've already checked in the tree
generate.pattern = (patterns, focus, pi, keys, ki, depth, propSet) => {
	if(patterns.length < pi || keys.length < ki) {
		// TODO: Should actually lead to the value I need...
		return {
			action: UNDEFINED
		};
	}
	const k = keys[ki];

	// if the key already exists I don't need to check it a second time...
	if(generate.propChecked(k, depth, propSet)) {
		return generate.pattern(patterns, focus, pi, keys, ki + 1, depth, propSet);
	}

	const part = focus[pi][k];
	if(part === generate.shouldUnfocus) {
		const nextFocus = generate.unfocusProps(depth, patterns);
		const nextDepth = depth.slice(0, depth.length - 1);
		const then = generate.pattern(patterns, nextFocus, keys, ki, nextDepth, propSet);
		return {
			action: UNWALK,
			then: then
		};
	}

	if(typeof part === 'object' && part !== null) {
		// slice to clone and then make it as though we're going through a different pattern...
		const nextFocus = generate.focusProps(k, focus);
		const nextDepth = depth.concat(k);
		const then = generate.pattern(patterns, nextFocus, pi, objectKeys(clone[pi]), 0,
			nextDepth, propSet);
		// otherwise, we can move to the next pattern...
		const nextPattern = focus[pi + 1];
		const elsKeys = objectKeys(nextPattern);
		const els = generate.pattern(patterns, nextFocus, pi + 1, elsKeys, 0, nextDepth, propSet);
		return {
			action: WALK,
			field: k,
			then: then,
			else: els
		};
	} else {
	}

	return {
		action: UNDEFINED
	};
};

const compile = (patterns) => {
	const tree = generate(patterns);
	return read.bind(null, tree);
};

exports.read = read;
exports.generate = generate;
exports.compile = compile;

exports.COMPARE = COMPARE;
exports.WALK = WALK;
exports.UNWALK = UNWALK;
exports.RETURN = RETURN;
exports.UNDEFINED = UNDEFINED;
