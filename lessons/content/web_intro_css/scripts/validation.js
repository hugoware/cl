
const ALT_COLORS = [ 'white', 'yellow', 'pink', 'aqua', 'silver' ];

export const validate_css_file = (state, includeParagraph, test) => {


	test.__w$
		.selector('body')
		.block()
		.declare([
			['background', state.selectedBackgroundColor ]
		])
		._n
		.endBlock()
		._n._n
		.__b;


	// determine what colors to match for
	let headingColor;
	let headingDeclaration = ['color'];
	if (state.selectedHeadingColor) 
		headingDeclaration.push(state.selectedHeadingColor);
	else {
		headingDeclaration = headingDeclaration.concat(ALT_COLORS);
		headingDeclaration.push(match => {
			headingColor = match;
		});
	}

	test.selector('h1')
		.block()
		.declare([ headingDeclaration ])
		._n
		.endBlock();

	// done matching
	if (!includeParagraph) {
		test.eof();
		return headingColor;
	}

	// get the choices
	const allow = [].concat(ALT_COLORS);
	const remove = allow.indexOf(state.selectedHeadingColor);
	if (remove > -1)
		allow.splice(remove, 1);

	// else, do this again
	test._n._n
		.__b
		.selector('p')
		.block()
		.declare([ [ 'color', ...allow ] ])
		._n
		.endBlock()
		.eof()

};


export const validate_background_color = (except, test) => {

	const colors = [
		'red',
		'green',
		'purple',
		'magenta',
		'gray'
	];

	// check for removing a color
	const remove = colors.indexOf(except);
	if (remove > -1) 
		colors.splice(remove, 1);

	// test the result
	let color;
	test.selector('body')
		.block()
		.declare([
			['background', ...colors, match => {
				color = match;
			}]
		])
		._n
		.endBlock();

	return color;

};


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


export const start_link_about = test => test
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

export const finish_link_about = test => test
	._t.close('head')._n
	.__b
	._t.tag('body')._n
	.__b
	._t._t.tag('h1').content(5, 50).close('h1')._n
	.__b
	._t._t.tag('p').content(5, 200).close('p')._n
	.__b
	._t._t.tag('p').content(5, 100).close('p')._n
	.__b
	._t._t.open('a')
		._s
		.attrs([
			['href', '/index.html']
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

