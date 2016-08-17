const test = require('ava');

module.exports = (match) => {

	test('simple patterns', t => {
		const fn1 = match([
			{ a: 1, b: 2 }, 1,
			{ a: 1, b: 3 }, 2,
			{ a: 1 }, 3
		]);

		t.is(fn1({ a: 1, b: 2, c: 3}), 1);
		t.is(fn1({ a: 1, b: 3, c: 123 }), 2);
		t.is(fn1({ a: 1, b: 100 }), 3);
	});

	test('deep patterns', t => {
		const fn2 = match([
			{
				a: 1,
				b: {
					c: 2,
					d: 3
				}
			}, 1,
			{
				a: 1,
				b: {
					c: 5
				}
			}, 2
		]);

		t.is(fn2({
			a: 1,
			b: {
				c: 2,
				d: 3
			}
		}), 1);

		t.is(fn2({
			a: 1,
			b: { c: 5}
		}), 2);

		t.is(fn2({
			a: 1,
			b: { c: 5 },
			d: 123
		}), 2);
	});

	test('handles arrays', t => {
		const fn3 = match([
			{
				a: [1, 2]
			}, 1,
			{
				b: [1, 2]
			}, 2,
			{
				a: 1,
				b: [1, 2]
			}, 3
		]);

		t.is(fn3({
			a: 1,
			b: [1, 2]
		}), 2);

		t.is(fn3({
			b: [1 ,2]
		}), 2);
	});

	test.skip('handles arrays in deep objects', t => {
	});

	test.skip('handles objects in arrays', t => {
	});
};
