import { _ } from './lib';
import { stringRange } from './utils';

const as_number = test => test
	.literal(/^[0-9]+/, 'Expected a number', match => {

		// make sure it doesn't start with a zero
		if (/^0[0-9]+/.test(match))
			return `Don't use a number that starts with a zero`;
		
		// check the number count
		const count = _.size(match);
		const error = stringRange(count, 5, 10, 'number', 'numbers');
		if (error) return error;

		return error;
	});

const validate_number_alert = test => test
	.func('alert')
	.symbol('(')
	.merge(as_number)
	.symbol(')')
	.symbol(';');

const validate_coding_alert = test => test
	.func('alert')
	.symbol('(')
	.merge(as_number)
	.symbol(')')
	.symbol(';');

const validate_insert_string = test => test
	.func('alert')
	.symbol('(')
	.string('JavaScript is fun')
	.symbol(')')
	.symbol(';');

const validate_free_string = test => test
	.func('alert')
	.symbol('(')
	.string(5, 25)
	.symbol(')')
	.symbol(';');

const validate_fix_number = test => test
	.func('alert')
	.symbol('(')
	.number(12345)
	.symbol(')')
	.symbol(';');

const validate_fix_string = test => test
	.func('alert')
	.symbol('(')
	.string('fix me!')
	.symbol(')')
	.symbol(';');

export const validate_repeat_alert = test => test
	.__w$
	.merge(validate_number_alert)
	._n
	.__w$
	.eof();

export const validate_free_alert = test => test
	.__w$
	.merge(validate_number_alert)
	._n
	.__w$
	.merge(validate_coding_alert)
	.__w$
	.eof();

export const validate_complete_repeat_alert = test => test
	.__w$
	.merge(validate_number_alert)
	._n
	.__w$
	.merge(validate_coding_alert)
	._n
	.__w$
	.merge(validate_number_alert)
	.__w$
	.eof();

export const validate_insert_string_alert = test => test
	.__w$
	.merge(validate_insert_string)
	._n
	.__w$
	.eof();

export const validate_free_string_alert = test => test
	.__w$
	.merge(validate_free_string)
	._n
	.__w$
	.eof();

export const validate_complete_fix_number_alert = test => test
	.__w$
	.merge(validate_fix_number)
	._n
	.__w$
	.eof();

export const validate_complete_fix_string_alert = test => test
	.__w$
	.merge(validate_fix_string)
	._n
	.__w$
	.eof();
