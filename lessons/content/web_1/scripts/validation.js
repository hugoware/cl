import { HtmlValidator } from './lib';

const validate_h1 = test => test
	.tag('h1')
	.content('hello, world!')
	.close('h1');

const validate_h3 = test => test
	.tag('h3')
	.content('HTML is great')
	.close('h3')

const validate_button = test => test
	.tag('button')
	.content('Click me')
	.close('button')


export const validate_insert_h3 = test => test
	.__w$
	.merge(validate_h1)
	._n
	.__w$
	.merge(validate_h3)
	.__w$
	.eof();

export const validate_insert_button = test => test
	.__w$
	.merge(validate_h1)
	._n
	.__w$
	.merge(validate_h3)
	._n
	.__w$
	.merge(validate_button)
	.__w$
	.eof();

export const validate_list = test => test
	.__w$
	.merge(validate_h1)
	._n
	.__w$
	.merge(validate_h3)
	._n
	.__w$
	.merge(validate_button)
	._n
	.__w$
	.tag('ol')._n
	._t.tag('li').text('dog').close('li')
	.progress('added-item')._n
	._t.tag('li').text('cat').close('li')._n
	._t.tag('li').text('fish').close('li')._n
	.close('ol')
	.__w$
	.eof();



// export const validate_h1 = test => test

// export const validate_h3 = test => test

// export const validate_button = test => test