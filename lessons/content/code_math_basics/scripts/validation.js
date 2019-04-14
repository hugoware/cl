
function twoSegmentExpression(test, limit) {
	const allowed = [ '+', '-', '/', '*' ];

	const limit_range = (match, num) => {
		if (!match) return 'Enter a number from 1 to 9999';
		if (num < 1) return 'Use a number greater than 0';
		if (num > 9999) return 'Use a number less than 10,000';
	};

	for (let i = 0; i < limit; i++) {

		test.id('console')
			.symbol('.')
			.func('log')
			.symbol('(')
			.number(limit_range)
			._s
			.symbol(...allowed, used => {
				const index = allowed.indexOf(used);
				allowed.splice(index, 1);
			})
			._s
			.number(limit_range)
			.symbol(')')
			.symbol(';')

		if (i + 1 !== limit) {
			test.lines(2);
		}

	}

}

function threeSegmentExpression(test, limit) {
	const allowed = [ '+', '-', '/', '*' ];

	const limit_range = (match, num) => {
		if (!match) return 'Enter a number from 1 to 9999';
		if (num < 1) return 'Use a number greater than 0';
		if (num > 9999) return 'Use a number less than 10,000';
	};

	for (let i = 0; i < limit; i++) {

		test.id('console')
			.symbol('.')
			.func('log')
			.symbol('(')
			.number(limit_range)
			._s
			.symbol(...allowed, used => {
				const index = allowed.indexOf(used);
				allowed.splice(index, 1);
			})
			._s
			.number(limit_range)
			._s
			.symbol(...allowed, used => {
				const index = allowed.indexOf(used);
				allowed.splice(index, 1);
			})
			._s
			.number(limit_range)
			.symbol(')')
			.symbol(';')

		if (i + 1 !== limit) {
			test.lines(2);
		}

	}

}

export const validate_basic_1 = test => {
	twoSegmentExpression(test, 4);
}

export const validate_basic_2 = test => {
	twoSegmentExpression(test, 2);
}

export const validate_basic_3 = test => {
	threeSegmentExpression(test, 2);
}

export const validate_variables = test => {
	let expects;

	const limit_range = (match, num) => {
		if (!match) return 'Enter a number from 1 to 100';
		if (num < 1) return 'Use a number greater than 0';
		if (num > 100) return 'Use a number less than 100';
	};

	test.declare('let')
		._s
		.id('rows')
		._s
		.symbol('=')
		._s
		.number(limit_range)
		.symbol(';')
		._n
		.lines(2)

		.declare('let')
		._s
		.id('columns')
		._s
		.symbol('=')
		._s
		.number(limit_range)
		.symbol(';')
		._n
		.lines(2)

		.declare('let')
		._s
		.id('cells')
		._s
		.symbol('=')
		._s
		.id('rows', 'columns', used => {
			if (used === 'rows') expects = 'columns';
			else if (used === 'columns') expects = 'rows';
		})
		._s
		.symbol('*')
		._s
		.id(expects)
		.symbol(';')
		._n
		.lines(2)

		.id('console')
		.symbol('.')
		.func('log')
		.symbol('(')
		.id('cells')
		.symbol(')')
		.symbol(';')

};











