
export const start_link_index = test => test
	.__w$
	.doctype('html')._n
	.tag('html')._n
	._t.tag('head')._n
	._t._t.tag('title').content(5, 25).close('title')._n
	.__b
	._t._t.open('link')
		._s
		.attrs([
			['rel', 'stylesheet'],
			['href', '/style.css']
		])
		._s$
		.close('/>');

export const finish_link_index = test => test
	._t.close('head')._n
	.__b
	._t.tag('body')._n
	.__b
	._t._t.tag('h1').content(5, 50).close('h1')._n
	.__b
	._t._t.tag('p').content(5, 50).close('p')._n
	.__b
	._t._t.open('a')
		._s
		.attrs([
			['href', '/about.html']
		])
		._s$
		.close('>')
	.content(5, 25)
	.close('a')._n
	.__b
	._t.close('body')
	.__b
	.close('html')
	.__w$
	.eof();

