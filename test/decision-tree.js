const test = require('ava');
const decisionTree = require('../lib/decision-tree');

const COMPARE = decisionTree.COMPARE;
const WALK = decisionTree.WALK;
const UNWALK = decisionTree.UNWALK;
const RETURN = decisionTree.RETURN;
const UNDEFINED = decisionTree.UNDEFINED;

const patterns = [
	{ a: 1, b: 2 }, 1,
	{ c: 2 }, 2,
	{ a: 1 }, 3,
	{
		a: 1,
		b: {
			c: {
				d: 2
			}
		}
	}, 4
];

const tree = {
	action: COMPARE,
	field: 'a',
	value: 1,
	ifTrue: {
		action: COMPARE,
		field: 'b',
		value: 2,
		ifTrue: {
			action: RETURN,
			value: 1
		},
		ifFalse: {
			action: COMPARE,
			field: 'c',
			value: 2,
			ifFalse: {
				action: WALK,
				field: 'c',
				then: {
					action: COMPARE,
					field: 'd',
					value: 2,
					ifTrue: {
						action: RETURN,
						value: 4
					},
					ifFalse: {
						action: RETURN,
						value: 3
					}
				},
				else: {
					action: RETURN,
					value: 3
				}
			},
			ifTrue: {
				action: RETURN,
				value: 2
			}
		}
	},
	ifFalse: {
		action: COMPARE,
		field: 'c',
		value: 2,
		ifTrue: {
			action: RETURN,
			value: 2
		},
		ifFalse: {
			action: UNDEFINED
		}
	}
};

test('read::return', t => {
	t.is(decisionTree.read(tree, { c: 2 }), 2);
});

test('read::undefined', t => {
	t.is(decisionTree.read(tree, { e: 9000 }), undefined);
});

test('compiler::simple', t => {
	var patterns = [
		{ a: 1, b: 2 }, 1,
		{ a: 1 }, 2
	];
	var shouldBe = {
		action: COMPARE,
		field: 'a',
		value: 1,
		ifTrue: {
			action: COMPARE,
			field: 'b',
			value: 2,
			ifTrue: {
				action: RETURN,
				value: 2
			},
			ifFalse: {
				action: UNDEFINED
			}
		},
		isFalse: {
			action: UNDEFINED
		}
	};
	t.is(decisionTree.generate(patterns), shouldBe);
});
