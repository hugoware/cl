
const validate_alert = test => test
	.id('alert')
	.symbol('(')
	.string(5, 25)
	.symbol(')')
	.symbol(';');

const validate_coding_alert = test => test
	.id('alert')
	.symbol('(')
	.string('coding is fun')
	.symbol(')')
	.symbol(';');

export const validate_repeat_alert = test => test
	.__w$
	.merge(validate_alert)
	._n;

export const validate_free_alert = test => test
	.__w$
	.merge(validate_alert)
	._n
	.__w$
	.merge(validate_coding_alert)
	.__w$;

export const validate_complete_repeat_alert = test => test
	.__w$
	.merge(validate_alert)
	._n
	.__w$
	.merge(validate_coding_alert)
	._n
	.__w$
	.merge(validate_alert);

export const validate_complete_fix_alert = test => test
	.__w$
	.merge(validate_alert)
	._n;

// const validate_starting_alert = test => test
// 	.;


// export const validate_first_free_alert = test => test
// 	._w
// 	.merge(validate_h1)
// 	._n
// 	.__w
// 	.merge(validate_h3)
// 	.__w
// 	.eof();

// export const validate_insert_button = test => test
// 	._w
// 	.merge(validate_h1)
// 	._n
// 	.__w
// 	.merge(validate_h3)
// 	._n
// 	.__w
// 	.merge(validate_button)
// 	.__w
// 	.eof();

// export const validate_list = test => test
// 	._w
// 	.merge(validate_h1)
// 	._n
// 	.__w
// 	.merge(validate_h3)
// 	._n
// 	.__w
// 	.merge(validate_button)
// 	._n
// 	.__w
// 	.tag('ol')._n
// 	._t.tag('li').text('dog').close('li')._n
// 	._t.tag('li').text('cat').close('li')._n
// 	._t.tag('li').text('fish').close('li')._n
// 	.close('ol')
// 	.eof();



// export const validate_h1 = test => test

// export const validate_h3 = test => test

// export const validate_button = test => test