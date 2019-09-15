

export const validate_start = test => test
	.__b
	.doctype('html')._n
	.tag('html')._n
	._t.tag('head')._n
	._t._t.tag('title').content('CodeLab Demo').close('title')._n;

export const validate_mid = test => test
	._t.close('head')._n
	._t.tag('body')._n;

export const validate_end = test => test
	._t.close('body')._n
	.close('html');

export const validate_heading = test => test
	._t._t.tag('h1').singleLine.content(5, 40).close('h1')._n;

export const validate_image = test => test
	._t._t.open('img')._s
		.attrs([
			['src', '/happy.png', '/love.png', '/sleep.png', '/meh.png' ]
		])
		._s$
		.close('/>')._n;

export const validate_stylesheet = test => test
	._t._t.open('link')._s
		.attrs([
			['rel', 'stylesheet' ],
			['href', '/style.css' ],
		])
		._s$
		.close('/>')._n;
