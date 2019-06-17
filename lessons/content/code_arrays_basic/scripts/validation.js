
export const validate_default_array = test => test
	
	.declare('let')._s.id('list')
		._s.symbol('=')
		._s.symbol('[')
		._n

	._t.string('bread').symbol(',')._n
	._t.string('eggs').symbol(',')._n
	._t.string('apples')._n

	.symbol(']').symbol(';');


export const validate_console_log_list = test => test	
	.id('console')
	.symbol('.')
	.func('log')
	.symbol('(')
	.id('list')
	.symbol(')')
	.symbol(';');

export const validate_console_log_list_index = (test, index) => test
	.id('console')
	.symbol('.')
	.func('log')
	.symbol('(')
	.id('list')
	.symbol('[')
	.number(index)
	.symbol(']')
	.symbol(')')
	.symbol(';');

export const validate_array_assign_index = (test, index, value) => test
	.id('list')
	.symbol('[')
	.number(index)
	.symbol(']')
	._s
	.symbol('=')
	._s
	.string(value)
	.symbol(';')

export const validate_add_item = test => test
	.id('list')
	.symbol('.')
	.func('push')
	.symbol('(')
	.string('milk')
	.symbol(')')
	.symbol(';');

export const validate_log_length = test => test
	.id('console')
	.symbol('.')
	.func('log')
	.symbol('(')
	.id('list')
	.symbol('.')
	.prop('length')
	.symbol(')')
	.symbol(';');