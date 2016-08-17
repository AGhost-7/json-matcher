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
		//console.log('next:', next);
		switch(next.action) {
			case COMPARE:
				// would throw on field access, besides this means it isn't what we wanted.
				if(value === null || value === undefined) {
					next = next.ifFalse;
					break;
				}

				if(next.value === value[next.field]) {
					//console.log('true', next.value, value[next.field], next.field);
					next = next.ifTrue;
				} else {
					//console.log('false', next.value, value[next.field], next.field);
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
			//default:
			//	console.log('error', next);
			//	throw new Error('not found');
		}
	}
};

const generate = (patterns) => {
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
