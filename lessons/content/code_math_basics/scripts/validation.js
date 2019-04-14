
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

export const validate_variables = (test, cookies, people) => {
	let expects;
	let alt;

	const limit_range = (match, num) => {
		if (!match) return 'Enter a number from 1 to 100';
		if (num < 1) return 'Use a number greater than 0';
		if (num > 100) return 'Use a number less than 100';
	};

	const check_cookies = (match, num) => {
		if (!isNaN(cookies) && num === cookies) return `Use a different number than \`${cookies}\``;
		test.append({ cookies: num });
		return limit_range(match, num);
	};

	const check_people = (match, num) => {
		if (!isNaN(people) && num === people) return `Use a different number than \`${people}\``;
		test.append({ people: num });
		return limit_range(match, num);
	};

	test.declare('let')
		._s
		.id('cookiesPerPerson', 'totalPeople', used => {
			if (used === 'cookiesPerPerson') alt = 'totalPeople';
			if (used === 'totalPeople') alt = 'cookiesPerPerson';
		})
		._s
		.symbol('=')
		._s;

	const [first_number, second_number] = alt === 'totalPeople'
		? [ check_cookies, check_people]
		: [ check_people, check_cookies];


	test.number(first_number)
		.symbol(';')
		._n
		.lines(2)

		.declare('let')
		._s
		.id(alt)
		._s
		.symbol('=')
		._s
		.number(second_number)
		.symbol(';')
		._n
		.lines(2)

		.declare('let')
		._s
		.id('totalCookies')
		._s
		.symbol('=')
		._s
		.id('cookiesPerPerson', 'totalPeople', used => {
			if (used === 'cookiesPerPerson') expects = 'totalPeople';
			else if (used === 'totalPeople') expects = 'cookiesPerPerson';
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
		.id('totalCookies')
		.symbol(')')
		.symbol(';')

};











