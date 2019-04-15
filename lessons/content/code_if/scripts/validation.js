import { _ } from 'lodash';

export const validate_ask = test => {

	test
		.declare('let')
		._s
		.id('totalStudents')
		._s
		.symbol('=')
		._s
		.id('console')
		.symbol('.')
		.func('ask')
		.symbol('(')
		.string('how many students?')
		.symbol(')')
		.symbol(';')
		._n
		.lines(2);
	
	test
		.declare('let')
		._s
		.id('totalBooks')
		._s
		.symbol('=')
		._s
		.id('console')
		.symbol('.')
		.func('ask')
		.symbol('(')
		.string('how many books?')
		.symbol(')')
		.symbol(';')
		._n;
	
};


export const validate_variables = (test, options = {}) => {
	const { same, flip } = options;

	let students;

	test
		.declare('let')
		._s
		.id('totalStudents')
		._s
		.symbol('=')
		._s
		.number((match, num) => {
			if (!_.some(match) || num < 1 || num > 100)
				return `Enter a number between 1 and 100`;

			students = num;
		})
		.symbol(';')
		._n
		.lines(2);
	
	test
		.declare('let')
		._s
		.id('totalBooks')
		._s
		.symbol('=')
		._s
		.number((match, num) => {
			if (!_.some(match) || num < 1 || num > 100)
				return `Enter a number between 1 and 100`;

			if (!!same) {
				if (num !== students)
					return `Enter the same number as \`totalStudents\``;
			}
			else {
				if (num >= students && !flip)
					return `Enter a number less than \`totalStudents\``;

				else if (num <= students && flip)
					return `Enter a number greater than \`totalStudents\``;
			}
		})
		.symbol(';')
		._n;

};

export const validate_if = (test, options) => {

	test
		.keyword('if')
		._s
		.symbol('(')
		.id('totalStudents')
		._s
		.symbol('>')
		._s
		.id('totalBooks')
		.symbol(')')
		._s
		.symbol('{')
		._n

		._t.id('console')
			.symbol('.')
			.func('log')
			.symbol('(')
			.string('not enough books')
			.symbol(')')
			.symbol(';')
			._n

		.symbol('}');

};

export const validate_else_if = (test, options) => {

	test
		.keyword('else')
		._s
		.keyword('if')
		._s
		.symbol('(')
		.id('totalStudents')
		._s
		.symbol('===')
		._s
		.id('totalBooks')
		.symbol(')')
		._s
		.symbol('{')
		._n

		._t.id('console')
			.symbol('.')
			.func('log')
			.symbol('(')
			.string('exactly enough books')
			.symbol(')')
			.symbol(';')
			._n

		.symbol('}');

};

export const validate_else = (test, options) => {

	test
		.keyword('else')
		._s
		.symbol('{')
		._n

		._t.id('console')
			.symbol('.')
			.func('log')
			.symbol('(')
			.string('there are enough books')
			.symbol(')')
			.symbol(';')
			._n

		.symbol('}');

};