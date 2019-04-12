import { _ } from './lib';

export const declare_number = (test, except) => {
	test
		.keyword('let')
		._s
		.id('age')
		._s
		.symbol('=')
		._s
		.number((match, num) => {
			if (match === _.toString(except))
				return `Expected a different a number than ${except}`;

			test.append({ num });
			return (!_.some(match) || num < 10 || num > 99) && 'Expected a number between 10 and 99';
		})
		.symbol(';')
		._n;
};

export const declare_string = (test, except) => {

	const allow = [ ];
	if ( except !== 'red') allow.push('red');
	if ( except !== 'green') allow.push('green');
	if ( except !== 'blue') allow.push('blue');

	test
		.keyword('let')
		._s
		.id('color')
		._s
		.symbol('=')
		._s
		.string(...allow, color => {
			test.append({ color });
		})
		.symbol(';')
		._n;
};

export const alert_messages = test => {

	let requires;

	test
		.func('alert')
		.symbol('(')
		.id('age', 'color', used => {
			requires = used === 'color' ? 'age' : 'color';
		})
		.symbol(')')
		.symbol(';')
		._n
		.__b;

	test
		.func('alert')
		.symbol('(')
		.id(requires)
		.symbol(')')
		.symbol(';')
		._n
		.__b;

};