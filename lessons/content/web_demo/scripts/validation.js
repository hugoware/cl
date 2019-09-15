

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

export const validate_paragraph = test => test
	._t._t.tag('p').singleLine.content(10, 40).close('p')._n;

export const validate_image = test => test
	._t._t.open('img')._s
		.attrs([
			['src', '/laugh.png', '/love.png', '/sleep.png' ]
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


export const validate_css_file = test => {
	let color;

	test
		.__w$
		.selector('body')
		.block()
		.declare([
			['font-family', 'sans-serif' ],
			['background', `red`, `blue`, `purple`, `magenta`, `orange`, (selected) => {
				color = selected;
			}],
			['text-align', 'center' ],
		])
		._n
		.endBlock()
		.lines(2)

		.selector('h1')
		.block()
		.declare([
			[ 'color', 'white' ],
			[ 'font-size', '90px' ],
			[ 'font-family', 'cursive' ],
		])
		._n
		.endBlock()
		.lines(2)

		.selector('p')
		.block()
		.declare([
			[ 'color', 'white' ],
		])
		._n
		.endBlock()
		.lines(2)

		.selector('img')
		.block()
		.declare([
			[ 'transition', 'all 2s' ],
			[ 'transform', 'rotate(-15deg) scale(0.8, 0.6)' ],
		])
		._n
		.endBlock()
		.lines(2)

		.selector('img')
		.text(':hover')
		.block()
		.declare([
			[ 'transform', 'rotate(-395deg) scale(1.5, 2.2)' ]
		])
		._n
		.endBlock()
		.lines(2)

		.__b;

	return color;

}