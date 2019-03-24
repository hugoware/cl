import HtmlValidator from '../src/client/app/validation/html-validator';

describe('HtmlValidator', () => {

	// this is a reused sequence for testing
	const incomplete_document_test = test => test
		.doctype('html')._n
		.tag('html')._n
		._t.tag('head')._n
		._t._t.tag('title').content('New Page').close('title')._n
		._t.close('head')._n
		._t.tag('body')._n
		._t._t.tag('ul')._n
		._t._t._t.tag('li').content().close('li')._n
		._t._t._t.tag('li').content().close('li')._n
		._t._t._t.tag('li').content().close('li')._n
		._t._t._t.tag('li').content().close('li')._n
		._t._t._t.tag('li').content().close('li')._n
		._t._t.close('ul')._n
		._t.close('body')._n
		.close('html');

	it('trim whitespace for content errors when empty', () => {

		const code = `<div>
		
</div>`;

		const result = HtmlValidator.validate(code, test => test
			.tag('div').trim.content(5).close('div'));

		expect(result.error).not.toBe(null);
		expect(result.error.start).toBe(9);

	});

	it('trim whitespace for content errors with partial content', () => {

		const code = `<div>
		a
</div>`;

		const result = HtmlValidator.validate(code, test => test
			.tag('div').trim.content(5).close('div'));

		expect(result.error).not.toBe(null);
		expect(result.error.start).toBe(10);

	});

	it('should capture content and not miss newline tests', () => {

		const code = `line 1
line 2`

		const result = HtmlValidator.validate(code, test => test
			.singleLine.content('line 1')
			._n
			.singleLine.content('line 2')
			.__w$
			.eof());

		expect(result.error).toBe(null);

	});

	it('should recognize missing content', () => {

		const code = `<ul>
	<li>
</ul>`;

		const result = HtmlValidator.validate(code, test => test
			.tag('ul')._n
			._t.tag('li').trim.content().close('li')._n
			.close('ul'));

		expect(result.error.message).toMatch(/expected content/i);

	});

	it('should check for minimum length', () => {

		const fail1 = HtmlValidator.validate(`<d>text</d>`, test => test
			.tag('d').content(5).close('d'));
		
		const pass1 = HtmlValidator.validate(`<d>text</d>`, test => test
			.tag('d').content(4).close('d'));
		
		const fail2 = HtmlValidator.validate(`<d> text </d>`, test => test
			.tag('d').trim.content(5).close('d'));
		
		const pass2 = HtmlValidator.validate(`<d> text </d>`, test => test
			.tag('d').trim.content(4).close('d'));

		const fail3 = HtmlValidator.validate(`<d>text</d>`, test => test
			.tag('d').content(6).close('d'));

		expect(fail1.error.message).toMatch(/1 more character/i);
		expect(fail2.error.message).toMatch(/1 more character/i);
		expect(pass1.error).toBe(null);
		expect(pass2.error).toBe(null);
		expect(fail3.error.message).toMatch(/2 more characters/i);

	});

	it('incomplete documents should make sense - #1', () => {
		const result = HtmlValidator.validate(``, incomplete_document_test);
		expect(result.error.message).toMatch(/expected a doctype/i);
	});

	it('incomplete documents should make sense - #2', () => {
		const result = HtmlValidator.validate(`<`, incomplete_document_test);
		expect(result.error.message).toMatch(/expected a doctype/i);
	});

	it('incomplete documents should make sense - #2.1', () => {
		const result = HtmlValidator.validate(`   <`, incomplete_document_test);
		expect(result.error.message).toMatch(/expected a doctype/i);
	});

	it('incomplete documents should make sense - #3', () => {
		const result = HtmlValidator.validate(`<!doctype`, incomplete_document_test);
		expect(result.error.message).toMatch(/expected uppercase/i);
	});

	it('incomplete documents should make sense - #3.1', () => {
		const result = HtmlValidator.validate(`<!doctype `, incomplete_document_test);
		expect(result.error.message).toMatch(/expected uppercase/i);
	});

	it('incomplete documents should make sense - #4', () => {
		const result = HtmlValidator.validate(`<!DOCTYPE `, incomplete_document_test);
		expect(result.error.message).toMatch(/expected doctype attribute: `html`/i);
	});
	
	it('incomplete documents should make sense - #5', () => {
		const result = HtmlValidator.validate(`<!DOCTYPE h`, incomplete_document_test);
		expect(result.error.message).toMatch(/expected doctype attribute: `html`/i);
	});

	it('incomplete documents should make sense - #6', () => {
		const result = HtmlValidator.validate(`<!DOCTYPE html`, incomplete_document_test);
		expect(result.error.message).toMatch(/expected close/i);
	});

	it('should work with complex scenarios', () => {
		const code = `<!DOCTYPE html>
<html>
	<head>
		<title>New Page</title>
	</head>
	<body>
		<ul>
			<li>item 1</li>
			<li>item 2</li>
			<li>item 3</li>
			<li>item 4</li>
			<li>item 5</li>
		</ul>
	</body>
</html>`;

		const result = HtmlValidator.validate(code, test => test
			.doctype('html')._n
			.tag('html')._n
			._t.tag('head')._n
			._t._t.tag('title').content('New Page').close('title')._n
			._t.close('head')._n
			._t.tag('body')._n
			._t._t.tag('ul')._n
			._t._t._t.tag('li').content().close('li')._n
			._t._t._t.tag('li').content().close('li')._n
			._t._t._t.tag('li').content().close('li')._n
			._t._t._t.tag('li').content().close('li')._n
			._t._t._t.tag('li').content().close('li')._n
			._t._t.close('ul')._n
			._t.close('body')._n
			.close('html')
			);

		expect(result.error).toBe(null);

	});

	it('should catch missing newlines', () => {
		const code = `<img/><img/>`;
		const result = HtmlValidator.validate(code, test => test
			.open('img')
			.close('/>')
			._n
			.open('img')
			.close('/>'));
	});

	it('should allow incomplete tags when start not closed', () => {
		const code = `<div><p`;
		const result = HtmlValidator.validate(code, test => test
			.open('div')
			.close('>')
			
			.open('p')
			.close('>')
			.close('p')
			
			.close('div'));

		expect(result.error.message).toMatch(/expected close/i);
		expect(result.error.start).toBe(7); // matching on paragraph, not div
	});


	it('should allow incomplete tags when start closed and end not created', () => {
		const code = `<div><p>`;
		const result = HtmlValidator.validate(code, test => test
			.open('div')
			.close('>')
			
			.open('p')
			.close('>')
			.close('p')
			
			.close('div'));

		expect(result.error.message).toMatch(/expected closing/i);
		expect(result.error.start).toBe(8); // matching on paragraph, not div
	});


	it('should allow incomplete tags when start closed and end not created for wrapper', () => {
		const code = `<div><p></p>`;
		const result = HtmlValidator.validate(code, test => test
			.open('div')
			.close('>')
			
			.open('p')
			.close('>')
			.close('p')
			
			.close('div'));

		expect(result.error.message).toMatch(/expected closing/i);
		expect(result.error.start).toBe(12); // matching on div
	});


	it('should catch extra code after end', () => {
		const result = HtmlValidator.validate(`<img /><br />`, test => test
			.open('img')
			._s
			.close('/>')
			.eof());

		expect(result.error.message).toMatch(/expected end of code/i);
	});


	it('should work with single attribute checks for doctypes', () => {
		const code = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	document
</html>`;

		const result = HtmlValidator.validate(code, test => test
			.doctype(
				'HTML',
				'PUBLIC',
				'"-//W3C//DTD HTML 4.01//EN"',
				'"http://www.w3.org/TR/html4/strict.dtd"'
			)._n

			.tag('html')
			.trim.content('document')
			.close('html'));

		expect(result.error).toBe(null);
	});


	it('should work with multi attribute checks for doctypes', () => {
		const code = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	document
</html>`;

		const result = HtmlValidator.validate(code, test => test
			.doctype(
				'HTML',
				'PUBLIC',
				'"-//W3C//DTD HTML 4.01//EN"',
				'"http://www.w3.org/TR/html4/strict.dtd"'
			)._n

			.tag('html')
			.trim.content('document')
			.close('html'));

		expect(result.error).toBe(null);
	});


	it('should capture missing attributes for the doctype', () => {
		const code = `<!DOCTYPE a b >
<html>
	document
</html>`;

		const result = HtmlValidator.validate(code, test => test
			.doctype('a', 'b', 'c')._n
			.tag('html')
			.trim.content('document')
			.close('html'));

		expect(result.error.message).toMatch(/expected doctype attribute/i);
	});

	
	it('should still give errors for incomplete doctypes', () => {
		// const code = `<!DOCTYPE HTML public`;
		// const result = HtmlValidator.validate(code, test => test
		// 	.open('doctype')
		// 	._
		// 	.attrs('html', 'public', "-//W3C//DTD HTML 4.01//EN", 'http://www.w3.org/TR/html4/strict.dtd'))
		// 	.__
		// 	.close('doctype');

		// expect(result.error).toBe(null);
	});

		
	it('should still consider order when provided as an array', () => {
		// const code = `<!DOCTYPE HTML public "mod-value" >`;
		
		// const result = HtmlValidator.validate(code, test => test
		// 	.doctype(['html', 'public', "mod-value"]));
		// expect(result.error).toBe(null);
	});

	const attr_test = test => test
		.__w$
		.open('img')
		._s
		.attr('src')
		.eq()
		.quote()
		.value('image')
		.closeQuote()
		._s$
		.close('/>')
		.__w$
		.eof();

	it('attributes should word with strange document formats - #1', () => {
		const code = `<img/>`;
		const result = HtmlValidator.validate(code, attr_test);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toMatch(/expected space/i);
	});

	it('attributes should word with strange document formats - #2', () => {
		const code = `<img />`;
		const result = HtmlValidator.validate(code, attr_test);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toMatch(/attribute name: \`src\`/i);
	});

	it('attributes should word with strange document formats - #3', () => {
		const code = `<img src />`;
		const result = HtmlValidator.validate(code, attr_test);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toMatch(/expected attribute assignment: \`=\`/i);
	});

	it('attributes should word with strange document formats - #4', () => {
		const code = `<img src= />`;
		const result = HtmlValidator.validate(code, attr_test);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toMatch(/expected opening quote: \`"\`/i);
	});

	it('attributes should word with strange document formats - #5', () => {
		const code = `<img src=" />`;
		const result = HtmlValidator.validate(code, attr_test);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toMatch(/attribute value: \`image\`/i);
	});

	it('attributes should word with strange document formats - #6', () => {
		const code = `<img src="image />`;
		const result = HtmlValidator.validate(code, attr_test);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toMatch(/expected closing quote: \`"\`/i);
	});

	it('attributes should word with strange document formats - #7', () => {
		const code = `<img src="image' />`;
		const result = HtmlValidator.validate(code, attr_test);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toMatch(/expected closing quote: \`"\`/i);
	});

	it('attributes should word with strange document formats - #8', () => {
		const code = `<img src="image" />`;
		const result = HtmlValidator.validate(code, attr_test);
		expect(result.error).toBe(null);
	});

	const multi_attrs = test => test
		.open('img')
		._s
		.attrs([
			['class', 'main'],
			['src', '/cat.jpg', 'dog.jpg'],
			['id', 'main']
		])
		._s$
		.close('/>');

	// work with multiples
	it('should simplify multiple attributes - #1', () => {
		const code = `<img />`;
		const result = HtmlValidator.validate(code, multi_attrs);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toBe('Expected attribute name: `class`, `src`, or `id`');
	});

	// work with multiples
	it('should simplify multiple attributes - #2', () => {
		const code = `<img src= />`;
		const result = HtmlValidator.validate(code, multi_attrs);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toBe('Expected opening quote: `"`');
	});

	// work with multiples
	it('should simplify multiple attributes - #3', () => {
		const code = `<img src />`;
		const result = HtmlValidator.validate(code, multi_attrs);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toBe('Expected attribute assignment: `=`');
	});

	// work with multiples
	it('should simplify multiple attributes - #4', () => {
		const code = `<img src=" />`;
		const result = HtmlValidator.validate(code, multi_attrs);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toBe('Expected attribute value: `/cat.jpg` or `dog.jpg`');
	});

	// work with multiples
	it('should simplify multiple attributes - #5', () => {
		const code = `<img src="/cat.jpg />`;
		const result = HtmlValidator.validate(code, multi_attrs);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toBe('Expected closing quote: `"`');
	});

	// work with multiples
	it('should simplify multiple attributes - #6', () => {
		const code = `<img src="/cat.jpg"/>`;
		const result = HtmlValidator.validate(code, multi_attrs);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toBe('Expected space');
	});

	// work with multiples
	it('should simplify multiple attributes - #7', () => {
		const code = `<img src="/cat.jpg" />`;
		const result = HtmlValidator.validate(code, multi_attrs);
		expect(result.error).not.toBe(null);
		expect(result.error.message).toBe('Expected attribute name: `class` or `id`');
	});


	it('should work with script tags', () => {
		const code = `<div>
		script
	<script type="text/javascript" >
		console.log('hello');
	</script>
</div>`;

		const result = HtmlValidator.validate(code, test => test
			.tag('div')._n
			._t._t.text('script')._n
			._t.open('script')
			._s.attrs('type', 'text/javascript')
			.__s.close('>')._n
			._t._t.seq('console', '.', 'log', '(', "'", 'hello', "'", ')', ';')._n
			._t.close('script')._n
			.close('div'));

		expect(result.error).toBe(null);
	});


	it('should work with style tags', () => {
		const code = `<div>
	style
	<style type="text/css" >
		div { color: #f00 }
	</style>
</div>`;

		const result = HtmlValidator.validate(code, test => test
			.tag('div')._n
			._t.text('style')._n
			._t.open('style')
			._s.attrs('type', 'text/css')
			.__s.close('>')._n
			._t._t.seq('div', ' ', '{', ' ', 'color', ':', ' ', '#f00', ' ', '}')._n
			._t.close('style')._n
			.close('div'));

		expect(result.error).toBe(null);
	});


	it('should work with script content', () => {
		const code = `<script>test  </script>`;
		const result1 = HtmlValidator.validate(code, test => test
			.tag('script')
			.__w$.text('test').__w$
			.close('script'));

		const result2 = HtmlValidator.validate(code, test => test
			.tag('script')
			.content()
			.close('script'));
		
		const result3 = HtmlValidator.validate(code, test => test
			.tag('script')
			.content('  test  ')
			.close('script'));
		
		const result4 = HtmlValidator.validate(code, test => test
			.tag('script')
			.content('fail')
			.close('script'));

		expect(result1.error).toBe(null);
		expect(result2.error).toBe(null);
		expect(result3.error.message).toMatch(/expected spaces/i);
		expect(result4.error.message).toMatch(/expected content/i);
	});

	
	it('should work with style content', () => {
		const code = `<style>  test  </style>`;
		const result1 = HtmlValidator.validate(code, test => test
			.tag('style')
			._s._s.text('test')._s._s
			.close('style'));

		const result2 = HtmlValidator.validate(code, test => test
			.tag('style')
			.content()
			.close('style'));
		
		const result3 = HtmlValidator.validate(code, test => test
			.tag('style')
			.content('fail')
			.close('style'));

		expect(result1.error).toBe(null);
		expect(result2.error).toBe(null);
		expect(result3.error.message).toMatch(/expected content/i);
	});


	it('should work with basic content', () => {
		const code = `<p>  test  </p>`;
		const result1 = HtmlValidator.validate(code, test => test
			.tag('p')

			// explicit check for spaces
			._s._s.text('test')._s._s
			.close('p'));

		const result2 = HtmlValidator.validate(code, test => test
			.tag('p')

			// explicit check for general whitespace
			.__w.text('test').__w
			.close('p'));

		const result3 = HtmlValidator.validate(code, test => test
			.tag('p')

			// wildcard whitespace check and content check
			.content()
			.close('p'));
		
		const result4 = HtmlValidator.validate(code, test => test
			.tag('p')

			// wildcard whitespace and incorrect text
			.content('fail')
			.close('p'));

		expect(result1.error).toBe(null);
		expect(result2.error).toBe(null);
		expect(result3.error).toBe(null);
		expect(result4.error.message).toMatch(/expected content/i);
	});

	it('should identify closing quotes for attributes', () => {

		const code = `<img src="/owl.png />`;
		const result = HtmlValidator.validate(code, test => test
			.open('img')
			._s
			.attrs('src', '/owl.png')
			._s$
			.close('/>')
			.eof());

		expect(result.error).not.toBe(null);
		expect(result.error.start).toBe(18);
		expect(result.error.message).toMatch(/closing quote/i);

	});


	it('should work with self close tags', () => {
		const result = HtmlValidator.validate(`<div />`, test => test
			.open('div')
			.__s
			.close('/>'));

		expect(result.error).toBe(null);
	});


	it('should work with html content tags', () => {
		const result = HtmlValidator.validate(`<div>content</div>`, test => test
			.open('div')
			.close('>')
			.content('content')
			.close('div'));

		expect(result.error).toBe(null);
	});


	it('should capture incorrect leading tag spacing for close tags', () => {
		const result = HtmlValidator.validate(`<div>content</ div>`, test => test
			.open('div')
			.close('>')
			.content('content')
			.close('div'));

		expect(result.error.message).toMatch(/expected closing tag: `div`/i);
	});


	it('should capture incorrect trailing tag spacing for close tags', () => {
		const result = HtmlValidator.validate(`<div>content</div >`, test => test
			.open('div')
			.close('>')
			.content('content')
			.close('div'));

		expect(result.error.message).toMatch(/expected closing tag: `>`/i);
	});


	it('should capture incorrect trailing tag spacing for open tags', () => {
		const result = HtmlValidator.validate(`< div>content</div>`, test => test
			.open('div')
			.close('>')
			.content('content')
			.close('div'));

		expect(result.error.message).toMatch(/expected opening tag: `div`/i);
	});


	it('should allow for optional spaces', () => {
		const result1 = HtmlValidator.validate(`<a/>`, test => test
			.open('a').__s$.close('/>'));

		const result2 = HtmlValidator.validate(`<a />`, test => test
			.open('a').__s$.close('/>'));

		expect(result1.error).toBe(null);
		expect(result2.error).toBe(null);
	});


	it('should catch invalid self close tags', () => {
		const result = HtmlValidator.validate(`<a/ >`, test => test
			.open('a')
			.close('/>'));

		expect(result.error.message).toMatch(/expected closing tag/i);
	});


	it('should property skip leading and trailing whitespace', () => {

		const code = `


<a />
			 
 

		`;

		const result = HtmlValidator.validate(code, test => test
			.__w.open('a').__s.close('/>'));

		expect(result.error).toBe(null);

	});

	it('should show good error messages for closing trailing slash', () => {
		const code = `

		<h1>welcome</h1>

		<h3>HTML is great<
		`;

		const result = HtmlValidator.validate(code, test => test
			.__w
			.tag('h1')
			.content()
			.close('h1')
			._n
			.__w
			.tag('h3')
			.text('HTML is great')
			.close('h3')
			.__w
			.eof());

		expect(result.error).not.toBe(null);
		expect(result.error.message).toMatch(/expected closing tag: `\/`/i);

	});

	it('should allow merging tests', () => {

		const tag_a = test => test.tag('a').close('a');
		const tag_b = test => test.tag('b').close('b');
		const tag_c = test => test.tag('c').close('c');

		const code = `<a></a>
<b></b>		<c></c>`;

		const result = HtmlValidator.validate(code, test => test
			.merge(tag_a)
			._n
			.merge(tag_b)
			.__w
			.merge(tag_c)
			.eof());

		expect(result.error).toBe(null);

	});


	it('should work for nested tags', () => {

		const code = `<div>
	<a>
		<img />
	</a>
</div>`;

		const result = HtmlValidator.validate(code, test => test
			.tag('div')._n
			._t.tag('a')._n
			._t._t.open('img')._s.close('/>')._n
			._t.close('a')._n
			.close('div'));

		expect(result.error).toBe(null);
	});



});