// import { CssValidator } from '../index';

// describe('CssValidator', () => {

// 	it('should clean up leading newlines with start', () => {
// 		const code = `
		
		
// .name { color: red; }`;

// 		const result = CssValidator.validate(code, test => test
// 			.selector('.name')
// 			._.symbol('{')
// 			._.rule('color')
// 			.symbol(':')
// 			._.word('red')
// 			.symbol(';')
// 			._.symbol('}'));

// 		expect(result.error).toBe(null);

// 	});

// 	it('should clean up messy leading/trailing whitespace', () => {

// 		const code = `   .name  {   
// 			color     :    red    ;    
// 		}    `;

// 		const result = CssValidator.validate(code, test => test
// 			.selector('.name')
// 			._
// 			.symbol('{')
// 			// should not capture trailing spacing
// 			.newline()
// 			// should not capture leading spaces
// 			.rule('color')
// 			.optional._
// 			.symbol(':')
// 			._
// 			.word('red')
// 			.optional._
// 			.symbol(';')

// 			// should not capture trailing spaces
// 			.newline()
// 			// should not capture leading spaces
// 			.symbol('}')
// 			// should not capture trailling spaces
// 			);

// 		expect(result.error).toBe(null);

// 	})

// 	it('should work with basic css', () => {

// 		const code = `.name { color : red; }`;
// 		const result = CssValidator.validate(code, test => test
// 			.selector('.name')
// 			._
// 			.symbol('{')
// 			._
// 			.rule('color')
// 			._
// 			.symbol(':')
// 			._
// 			.word('red')
// 			.symbol(';')
// 			._
// 			.symbol('}'));

// 		expect(result.error).toBe(null);

// 	});

// 	it('should allow for optional parameters', () => {
// 		const code = `.name {
// 			rule: red
// 			rule  :  blue
// 		}`;

// 		const result = CssValidator.validate(code, test => test
// 			.selector('.name')
// 			.optional._
// 			.symbol('{')
// 			.newline()

// 			.rule('rule')
// 			.optional._
// 			.symbol(':')
// 			._
// 			.word('red')
// 			.newline()

// 			.rule('rule')
// 			.optional._
// 			.symbol(':')
// 			._
// 			.word('blue')
// 			.newline()
			
// 			.symbol('}'));

// 		expect(result.error).toBe(null);

// 	});

// 	it('should watch for newlines', () => {

// 		const code = `.name {
// 	color: red;
	

// 	color: blue;


// 	color: green;
// }`

// 		const result = CssValidator.validate(code, test => test
// 			.selector('.name')
// 			._
// 			.symbol('{')
// 			.newline()

// 			.rule('color')
// 			.symbol(':')
// 			._
// 			.word('red')
// 			.symbol(';')

// 			// strict single line matching
// 			.newline(true)
// 			.newline(true)
// 			.newline(true)
			
// 			.rule('color')
// 			.symbol(':')
// 			._
// 			.word('blue')
// 			.symbol(';')
			
// 			// flexible multi line
// 			.newline()

// 			.rule('color')
// 			.symbol(':')
// 			._
// 			.word('green')
// 			.symbol(';')
// 			.newline()

// 			.symbol('}'));

// 		expect(result.error).toBe(null);

// 	});

// 	// it('should work with media queries', () => { });
// 	// it('should work with import commands', () => { });
// 	// it('should work with fonts', () => { });
// 	// it('should work with animations', () => { });

// 	it('should work with tag names', () => {

// 		const code = `img { }`;

// 		const result = CssValidator.validate(code, test => test
// 			.selector('img')
// 			._
// 			.symbol('{')
// 			._
// 			.symbol('}')
// 			.end());

// 		expect(result.error).toBe(null);

// 	});

// 	it('should work with complex rule properties', () => {

// 		const code = `.name {
// 			text-shadow: 0 1px 2px #000;
// 			border: solid 2px red;
// 		}`;

// 		const result = CssValidator.validate(code, test => test
// 			.selector('.name')
// 			._
// 			.symbol('{')
// 			.newline()

// 			.rule('text-shadow')
// 			.symbol(':')
// 			._
// 			.num(0)
// 			._
// 			.num(1)
// 			.unit('px')
// 			._
// 			.num(2)
// 			.unit('px')
// 			._
// 			.word('#000')
// 			.symbol(';')
// 			.newline()
			
// 			.rule('border')
// 			.symbol(':')
// 			._
// 			.word('solid')
// 			._
// 			.num(2)
// 			.unit('px')
// 			._
// 			.word('red')
// 			.symbol(';')
// 			.newline()
			
// 			.symbol('}'));

// 		expect(result.error).toBe(null);

// 	});

// 	it('should with with properties that have arguments', () => {

// 		const code = `.name {
// 			transform: translate(10px, 20%, 45deg);
// 			background: url("main.jpg");
// 		}`;

// 		const result = CssValidator.validate(code, test => test
// 			.selector('.name')
// 			._
// 			.symbol('{')
// 			.newline()

// 			.rule('transform')
// 			.symbol(':')
// 			._
// 			.word('translate')
// 			.symbol('(')
// 			.num(10)
// 			.unit('px')
// 			.symbol(',')
// 			._
// 			.num(20)
// 			.unit('%')
// 			.symbol(',')
// 			._
// 			.num(45)
// 			.unit('deg')
// 			.symbol(')')
// 			.symbol(';')
// 			.newline()

// 			.rule('background')
// 			.symbol(':')
// 			._
// 			.keyword('url')
// 			.symbol('(')
// 			.str('main.jpg')
// 			.symbol(')')
// 			.symbol(';')
// 			.newline()

// 			.symbol('}')
// 			.end());

// 		expect(result.error).toBe(null);

// 	});

// 	it('should check strings for quotes', () => {

// 		const err1 = CssValidator.validate(`url(main.jpg)`, test => test
// 			.word('url').symbol('(').str('main.jpg').symbol(')'))
		
// 		// this is an unfinished string, like it might appear while typing
// 		const err2 = CssValidator.validate(`url("main.jpg`, test => test
// 		.word('url').symbol('(').str('main.jpg').symbol(')'))
		
// 		const err3 = CssValidator.validate(`url(main.jpg")`, test => test
// 		.word('url').symbol('(').str('main.jpg').symbol(')'))
		
// 		const err4 = CssValidator.validate(`url("main2.jpg")`, test => test
// 		.word('url').symbol('(').str('main.jpg').symbol(')'))
		
// 		// this is an unfinished string, like it might appear while typing
// 		const err5 = CssValidator.validate(`url('main.jpg`, test => test
// 			.word('url').symbol('(').str('main.jpg').symbol(')'))
		
// 		const err6 = CssValidator.validate(`url(main.jpg')`, test => test
// 			.word('url').symbol('(').str('main.jpg').symbol(')'))
		
// 		const err7 = CssValidator.validate(`url('main2.jpg')`, test => test
// 			.word('url').symbol('(').str('main.jpg').symbol(')'))

// 		expect(err1.error.type).toBe('symbol');
// 		expect(err2.error.type).toBe('symbol');
// 		expect(err3.error.type).toBe('symbol');
// 		expect(err4.error.type).toBe('string');
// 		expect(err5.error.type).toBe('symbol');
// 		expect(err6.error.type).toBe('symbol');
// 		expect(err7.error.type).toBe('string');

// 	});

// 	it('should be forgiving with newlines', () => {

// 		const code = `name {

// 			color: red;

// 		}`;

// 		const result = CssValidator.validate(code, test => test
// 			.selector('name')
// 			._
// 			.symbol('{')
			
// 			// captures 2
// 			.newline()

// 			.rule('color')
// 			.optional._
// 			.symbol(':')
// 			._
// 			.word('red')
// 			.symbol(';')

// 			// captures 2
// 			.newline()
			
// 			.symbol('}')
// 			.end());

// 		expect(result.error).toBe(null);
// 	});

// 	it('should work with psuedo selectors', () => {

// 		const code = `#name:hover:nth-child { }`;

// 		const result = CssValidator.validate(code, test => test
// 			.selector('#name')
// 			.pseudo('hover')
// 			.pseudo('nth-child')
// 			._
// 			.symbol('{')
// 			._
// 			.symbol('}'));

// 		expect(result.error).toBe(null);
// 	});

// 	it('should with with pseudo selectors with arguments', () => {

// 		const code = `#name:hover(even):nth-child(3rd) { }`;

// 		const result = CssValidator.validate(code, test => test
// 			.selector('#name')
// 			.pseudo('hover')
// 			.symbol('(')
// 			.keyword('even')
// 			.symbol(')')
// 			.pseudo('nth-child')
// 			.symbol('(')
// 			.num(3)
// 			.unit('rd')
// 			.symbol(')')
// 			._
// 			.symbol('{')
// 			._
// 			.symbol('}'));

// 		expect(result.error).toBe(null);

// 	});

// 	it('should work with stacked selector names', () => {
// 		const code = `img .class #id { }`
// 		const result = CssValidator.validate(code, test => test
// 			.selector('img')
// 			._
// 			.selector('.class')
// 			._
// 			.selector('#id')
// 			._
// 			.symbol('{')
// 			._
// 			.symbol('}'));

// 		expect(result.error).toBe(null);

// 	});

// 	it('should check multiple possible options', () => {

// 		const code = `.name { color: blue; }`;
// 		const result = CssValidator.validate(code, test => test
// 			.selector('.name')
// 			._
// 			.symbol('{')
// 			._
// 			.rule('color')
// 			.optional._
// 			.symbol(':')
// 			._
// 			.word('red', 'green', 'blue')
// 			.symbol(';')
// 			._
// 			.symbol('}'));

// 		expect(result.error).toBe(null);

// 	})

// });