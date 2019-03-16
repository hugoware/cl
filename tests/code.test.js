
import CodeValidator from '../src/client/app/validation/code-validator';

describe('CodeValidator', () => {

	it('should allow optional single whitespaces', () => {
		const spaces = test => test.id('a')._s$.id('b');
		const space1 = CodeValidator.validate('ab', spaces);
		const space2 = CodeValidator.validate('a b', spaces);
		const space3 = CodeValidator.validate('a  b', spaces);

		const tabs = test => test.id('a')._t$.id('b');
		const tab1 = CodeValidator.validate('ab', tabs);
		const tab2 = CodeValidator.validate('a\tb', tabs);
		const tab3 = CodeValidator.validate('a\t\tb', tabs);

		const newlines = test => test.id('a')._w$.id('b');
		const newline1 = CodeValidator.validate('ab', newlines);
		const newline2 = CodeValidator.validate('a\nb', newlines);
		const newline3 = CodeValidator.validate('a\n\nb', newlines);

		const whitespaces = test => test.id('a')._w$.id('b');
		const whitespace1 = CodeValidator.validate('ab', whitespaces);
		const whitespace2 = CodeValidator.validate('a b', whitespaces);
		const whitespace3 = CodeValidator.validate('a  b', whitespaces);

		expect(space1.error).toBe(null);
		expect(space2.error).toBe(null);
		expect(space3.error).not.toBe(null);
		expect(space3.error.message).toMatch(/expected id/i)
		expect(tab1.error).toBe(null);
		expect(tab2.error).toBe(null);
		expect(tab3.error).not.toBe(null);
		expect(tab3.error.message).toMatch(/expected id/i)
		expect(newline1.error).toBe(null);
		expect(newline2.error).toBe(null);
		expect(newline3.error).not.toBe(null);
		expect(newline3.error.message).toMatch(/expected id/i)
		expect(whitespace1.error).toBe(null);
		expect(whitespace2.error).toBe(null);
		expect(whitespace3.error).not.toBe(null);
		expect(whitespace3.error.message).toMatch(/expected id/i)
	});

	it('have correct lines for errors', () => {

		const code = `a

a`;

		const result = CodeValidator.validate(code, test => test
			.id('a')
			._n
			.__w$
			.func('alert'));

		expect(result.error.start).toBe(3);
		expect(result.error.end).toBe(3);

	});

	it('should allow literal matches', () => {
		const validate = test => test
			.func('alert')
			.symbol('(')
			.literal(/^[0-9]+/, 'Expected number', match => {
				if (match.length > 10)
					return 'Too many numbers';
			})
			.symbol(')')
			.symbol(';')
			.eof();

		const result1 = CodeValidator.validate(`alert('hello');`, validate);
		const result2 = CodeValidator.validate(`alert(12345);`, validate);
		const result3 = CodeValidator.validate(`alert(1234567890);`, validate);
		const result4 = CodeValidator.validate(`alert(123456789012345);`, validate);
		const result5 = CodeValidator.validate(`alert(12345');`, validate);

		expect(result1.error).not.toBe(null);
		expect(result1.error.message).toMatch(/expected number/i);
		
		expect(result2.error).toBe(null);
		expect(result3.error).toBe(null);

		expect(result4.error).not.toBe(null);
		expect(result4.error.message).toMatch(/too many numbers/i);
		
		expect(result5.error).not.toBe(null);
		expect(result5.error.message).toMatch(/expected symbol/i);
	});

	it('should not include terminators in length', () => {

		const code = `alert("
		
`;
		const result = CodeValidator.validate(code, test => test
			.id('alert')
			.symbol('(')
			.string(5, 25));

		expect(result.error).not.toBe(null);
		expect(result.error.message).toMatch(/5 more characters/i);

	});

	it('should track progress', () => {
		let flag;

		const test = test => test
			.id('a')
			.progress('first')
			._s
			.id('b')
			.progress(() => { flag = 'mid'; })
			._s
			.id('c')
			.progress(() => { flag = 'last' }, 'last')
			.eof();

		flag = null;
		const result1 = CodeValidator.validate(``, test);
		expect(result1.progress).toBe(null);
		expect(flag).toBe(null);
		
		flag = null;
		const result2 = CodeValidator.validate(`a`, test);
		expect(result2.progress).toBe('first');
		expect(flag).toBe(null);
		
		flag = null;
		const result3 = CodeValidator.validate(`a b`, test);
		expect(result3.progress).toBe('first');
		expect(flag).toBe('mid');
		
		flag = null;
		const result4 = CodeValidator.validate(`a b c`, test);
		expect(result4.progress).toBe('last');
		expect(flag).toBe('last');

	});

	it('should check for declared variables', () => {

		const result = CodeValidator.validate(`const a = "hello";`, test => test
			.declare('const')
			._s
			.id('a')
			._s
			.symbol('=')
			._s
			.string('hello')
			.symbol(';')
			.eof());

		expect(result.error).toBe(null);
	});

	describe('strings', () => {

		it('work for multiple quote types', () => {
			const result1 = CodeValidator.validate(`"a"`, test => test.string('a'));
			const result2 = CodeValidator.validate(`'a'`, test => test.string('a'));
			expect(result1).not.toBe(null);
			expect(result2).not.toBe(null);
		});

		it('identify missing ending quotes', () => {
			const result1 = CodeValidator.validate(`"a'`, test => test.string('a'));
			const result2 = CodeValidator.validate(`'a"`, test => test.string('a'));
			const result3 = CodeValidator.validate(`'a`, test => test.string('a'));
			const result4 = CodeValidator.validate(`"a`, test => test.string('a'));
			expect(result1.error.message).toMatch(/closing quote/i);
			expect(result2.error.message).toMatch(/closing quote/i);
			expect(result3.error.message).toMatch(/closing quote/i);
			expect(result4.error.message).toMatch(/closing quote/i);
		});

		it('identify missing start quotes', () => {
			const result1 = CodeValidator.validate(`a'`, test => test.string('a'));
			const result2 = CodeValidator.validate(`a"`, test => test.string('a'));
			const result3 = CodeValidator.validate(`a`, test => test.string('a'));
			const result4 = CodeValidator.validate(`a`, test => test.string('a'));
			expect(result1.error.message).toMatch(/opening quote/i);
			expect(result2.error.message).toMatch(/opening quote/i);
			expect(result3.error.message).toMatch(/opening quote/i);
			expect(result4.error.message).toMatch(/opening quote/i);
		});

		it('should handle checking for whitespace and trimming', () => {
			const trim1 = CodeValidator.validate(`" test "`, test => test.string('test'));
			const trim2 = CodeValidator.validate(`"test "`, test => test.string('test'));
			const trim3 = CodeValidator.validate(`" test"`, test => test.string('test'));
			const trim4 = CodeValidator.validate(`"  test"`, test => test.string('test'));
			const trim5 = CodeValidator.validate(`"test  "`, test => test.string('test'));
			const trim6 = CodeValidator.validate(`" test "`, test => test.trim.string('test'));
			const trim7 = CodeValidator.validate(`"test "`, test => test.trim.string('test'));
			const trim8 = CodeValidator.validate(`" test"`, test => test.trim.string('test'));
			const trim9 = CodeValidator.validate(`"  test"`, test => test.trim.string('test'));
			const trim10 = CodeValidator.validate(`"test  "`, test => test.trim.string('test'));

			expect(trim1.error).not.toBe(null);
			expect(trim1.error.message).toMatch(/unexpected space at start/i);
			expect(trim2.error).not.toBe(null);
			expect(trim2.error.message).toMatch(/unexpected space at end/i);
			expect(trim3.error).not.toBe(null);
			expect(trim3.error.message).toMatch(/unexpected space at start/i);
			expect(trim4.error).not.toBe(null);
			expect(trim4.error.message).toMatch(/unexpected spaces at start/i);
			expect(trim5.error).not.toBe(null);
			expect(trim5.error.message).toMatch(/unexpected spaces at end/i);
			expect(trim6.error).toBe(null);
			expect(trim7.error).toBe(null);
			expect(trim8.error).toBe(null);
			expect(trim9.error).toBe(null);
			expect(trim10.error).toBe(null);
		});

		it('should use validators with ranges', () => {
			let captured;
			const result = CodeValidator.validate(`"abcde"`, test =>
				test.string(3, 7, valid => { captured = valid; }))

			expect(result.error).toBe(null);
			expect(captured).toBe('abcde');
		});

		it('should handle checking for min/max ranges', () => {
			const trim1 = CodeValidator.validate(`"1234567"`, test => test.string(5, 10));
			const trim2 = CodeValidator.validate(`"  1234567  "`, test => test.trim.string(5, 10));
			const trim3 = CodeValidator.validate(`"1234567"`, test => test.string(3, 5));
			const trim4 = CodeValidator.validate(`"  1234567  "`, test => test.trim.string(3, 5));

			expect(trim1.error).toBe(null);
			expect(trim2.error).toBe(null);
			expect(trim3.error).not.toBe(null);
			expect(trim3.error.message).toMatch(/expected 2 less/i);
			expect(trim4.error).not.toBe(null);
			expect(trim4.error.message).toMatch(/expected 2 less/i);
		});

		it('should handle checking for min ranges', () => {
			const trim1 = CodeValidator.validate(`" test "`, test => test.string(4));
			const trim2 = CodeValidator.validate(`"test "`, test => test.string(4));
			const trim3 = CodeValidator.validate(`" test"`, test => test.string(4));
			const trim4 = CodeValidator.validate(`"  test"`, test => test.string(4));
			const trim5 = CodeValidator.validate(`"test  "`, test => test.string(4));
			const trim6 = CodeValidator.validate(`" abc "`, test => test.trim.string(3));
			const trim7 = CodeValidator.validate(`"abc "`, test => test.trim.string(3));
			const trim8 = CodeValidator.validate(`" abc"`, test => test.trim.string(3));
			const trim9 = CodeValidator.validate(`"  abc"`, test => test.trim.string(3));
			const trim10 = CodeValidator.validate(`"abc  "`, test => test.trim.string(3));
			
			const trim11 = CodeValidator.validate(`" abc "`, test => test.string(10));
			const trim12 = CodeValidator.validate(`"abc "`, test => test.string(10));
			const trim13 = CodeValidator.validate(`" abc"`, test => test.string(10));
			const trim14 = CodeValidator.validate(`"  abc"`, test => test.string(10));
			const trim15 = CodeValidator.validate(`"abc  "`, test => test.string(10));
			const trim16 = CodeValidator.validate(`" abc "`, test => test.trim.string(4));
			const trim17 = CodeValidator.validate(`"abc "`, test => test.trim.string(4));
			const trim18 = CodeValidator.validate(`" abc"`, test => test.trim.string(4));
			const trim19 = CodeValidator.validate(`"  abc"`, test => test.trim.string(4));
			const trim20 = CodeValidator.validate(`"abc  "`, test => test.trim.string(4));

			// these work because the range exceeds the requirement
			expect(trim1.error).toBe(null);
			expect(trim2.error).toBe(null);
			expect(trim3.error).toBe(null);
			expect(trim4.error).toBe(null);
			expect(trim5.error).toBe(null);

			// these work because they are trimmed and still meet the requirement
			expect(trim6.error).toBe(null);
			expect(trim7.error).toBe(null);
			expect(trim8.error).toBe(null);
			expect(trim9.error).toBe(null);
			expect(trim10.error).toBe(null);

			// untrimmed but don't meet the requirement
			expect(trim11.error).not.toBe(null);
			expect(trim11.error.message).toMatch(/expected at least 5 more/i);
			expect(trim12.error).not.toBe(null);
			expect(trim12.error.message).toMatch(/expected at least 6 more/i);
			expect(trim13.error).not.toBe(null);
			expect(trim13.error.message).toMatch(/expected at least 6 more/i);
			expect(trim14.error).not.toBe(null);
			expect(trim14.error.message).toMatch(/expected at least 5 more/i);
			expect(trim15.error).not.toBe(null);
			expect(trim15.error.message).toMatch(/expected at least 5 more/i);

			// trimmed but don't meet the requirement
			expect(trim16.error).not.toBe(null);
			expect(trim16.error.message).toMatch(/expected at least 1 more/i);
			expect(trim17.error).not.toBe(null);
			expect(trim17.error.message).toMatch(/expected at least 1 more/i);
			expect(trim18.error).not.toBe(null);
			expect(trim18.error.message).toMatch(/expected at least 1 more/i);
			expect(trim19.error).not.toBe(null);
			expect(trim19.error.message).toMatch(/expected at least 1 more/i);
			expect(trim20.error).not.toBe(null);
			expect(trim20.error.message).toMatch(/expected at least 1 more/i);
		});

	});

	describe('templated strings', () => {

		const string_template_test = test => test
			.declare('const')
			._s
			.id('a')
			._s
			.assign('=')
			._s
			.tmplStart('start ')
			.id('x')
			.tmplEnd(' end')
			.symbol(';')
			.eof();
	
		it('should warn of missing spaces', () => {
			const code = 'const a = `start${';
			const result = CodeValidator.validate(code, string_template_test);
			expect(result.error).not.toBe(null);
			expect(result.error.message).toMatch(/expected space/i);
		});


		it('should work with simple templated strings', () => {

			const code = 'const a = `start ${x} end`;';
			const result = CodeValidator.validate(code, test => test
				.declare('const')
				._s
				.id('a')
				._s
				.assign('=')
				._s
				.tmplStart('start ')
				.id('x')
				.tmplEnd(' end')
				.symbol(';')
				.eof());

			expect(result.error).toBe(null);

		});

		it('should work with continued templates', () => {

			const code = "`first ${a} second ${b} third ${c} fourth`";
			const result = CodeValidator.validate(code, test => test
				.tmplStart('first ')
				.id('a')
				.tmplContinue(' second ')
				.id('b')
				.tmplContinue(' third ')
				.id('c')
				.tmplEnd(' fourth')
				.eof());

			expect(result.error).toBe(null);

		});

		it('track spacing issues with templated string', () => {

			const result1 = CodeValidator.validate("`first ${a}`",
				test => test.tmplStart('first').id('a'));
			
			const result2 = CodeValidator.validate("`first${a}`",
				test => test.tmplStart('first ').id('a'));
			
			const result3 = CodeValidator.validate("` first${a}`",
				test => test.tmplStart('first').id('a'));
			
			const result4 = CodeValidator.validate("`first${a}`",
				test => test.tmplStart(' first').id('a'));

			expect(result1.error).not.toBe(null);
			expect(result1.error.message).toMatch(/unexpected space at end/i);
			expect(result2.error).not.toBe(null);
			expect(result2.error.message).toMatch(/expected space at end/i);
			expect(result3.error).not.toBe(null);
			expect(result3.error.message).toMatch(/unexpected space at start/i);
			expect(result4.error).not.toBe(null);
			expect(result4.error.message).toMatch(/expected space at start/i);

		});

	});

	it('should work with a variety of types', () => {

		const result1 = CodeValidator.validate(`const a = 'name';`, 
			test => test.declare('const')._s.id('a')._s.assign('=')._s.string('name').symbol(';').eof());
		
		const result2 = CodeValidator.validate(`const a = 0;`, 
			test => test.declare('const')._s.id('a')._s.assign('=')._s.number(0).symbol(';').eof());
		
		const result3 = CodeValidator.validate(`const a = 1;`, 
			test => test.declare('const')._s.id('a')._s.assign('=')._s.number(1).symbol(';').eof());
		
		const result4 = CodeValidator.validate(`const a = Infinity;`, 
			test => test.declare('const')._s.id('a')._s.assign('=')._s.number(Infinity).symbol(';').eof());
		
		const result5 = CodeValidator.validate(`const a = false;`, 
			test => test.declare('const')._s.id('a')._s.assign('=')._s.boolean(false).symbol(';').eof());
		
		const result6 = CodeValidator.validate(`const a = true;`, 
			test => test.declare('const')._s.id('a')._s.assign('=')._s.boolean(true).symbol(';').eof());

		expect(result1.error).toBe(null);
		expect(result2.error).toBe(null);
		expect(result3.error).toBe(null);
		expect(result4.error).toBe(null);
		expect(result5.error).toBe(null);
		expect(result6.error).toBe(null);

	});

	it('should handle loops', () => {

		const code = `for (let i = 0; i < 10; i++) {
	console.log(i);
}`;

		const result = CodeValidator.validate(code, test => test
			.loop('for')
			._s
			.symbol('(')
			.declare('let')
			._s
			.id('i')
			._s
			.assign('=')
			._s
			.number(0)
			.symbol(';')
			._s
			.id('i')
			._s
			.symbol('<')
			._s
			.number(10)
			.symbol(';')
			._s
			.id('i')
			.operator('++')
			.symbol(')')
			._s
			.symbol('{')
			._n
			._t
			.obj('console')
			.symbol('.')
			.func('log')
			.symbol('(')
			.id('i')
			.symbol(')')
			.symbol(';')
			._n
			.symbol('}')
			.eof());

		expect(result.error).toBe(null);
	});

	it('should capture simple template strings', () => {

		const result = CodeValidator.validate("`a ${term} b`", test => test
			.tmplStart('a ')
			.id('term')
			.tmplEnd(' b')
			.eof());
		
		expect(result.error).toBeFalsy();

	});

	it('should capture alternative type template strings', () => {

		const result = CodeValidator.validate("`a ${55} b`", test => test
			.tmplStart('a ')
			.number(55)
			.tmplEnd(' b')
			.eof());
		
		expect(result.error).toBeFalsy();

	});

	it('should capture complex type template strings', () => {

		const result = CodeValidator.validate("`a ${10 + false - 'name'} b`", test => test
			.tmplStart('a ')
			.number(10)
			._s
			.symbol('+')
			._s
			.boolean(false)
			._s
			.symbol('-')
			._s
			.string('name')
			.tmplEnd(' b')
			.eof());
		
		expect(result.error).toBeFalsy();

	});

	it('should capture linear nested templates', () => {

		const result = CodeValidator.validate('`a ${`b ${false}`}`', test => test
			.tmplStart('a ')
			.tmplStart('b ')
			.boolean(false)
			.tmplEnd()
			.tmplEnd()
			.eof());

		expect(result.error).toBeFalsy();
	});

	it('should oxfordize params correctly', () => {

		const result1 = CodeValidator.validate('d', test => test.id('a'));
		const result2 = CodeValidator.validate('d', test => test.id('a', 'b'));
		const result3 = CodeValidator.validate('d', test => test.id('a', 'b', 'c'));

		expect(result1.error.message).toBe('Expected identifier: `a`');
		expect(result2.error.message).toBe('Expected identifier: `a` or `b`');
		expect(result3.error.message).toBe('Expected identifier: `a`, `b`, or `c`');
	});


	it('should allow additional paramters for return values', () => {

		const code = 'a b c';
		const result = CodeValidator.validate(code, test => test
			.append({ vars: 3 })
			.id('a')._s
			.id('b')._s
			.id('c'));

		expect(result.error).toBeFalsy();
		expect(result.vars).not.toBeFalsy();
		expect(result.vars).toBe(3);
	});

	it('should allow multiple validators', () => {

		const code = `const a = 200;
console.log(a);`;

		const validatorA = test => test
			.declare('const')
			._s
			.id('a')
			._s
			.symbol('=')
			._s
			.number(200)
			.symbol(';');

		const validatorB = test => test
			._n
			.id('console')
			.symbol('.')
			.id('log')
			.symbol('(')
			.id('a')
			.symbol(')')
			.symbol(';');

		const result = CodeValidator.validate(code, validatorA, validatorB);
		expect(result.error).toBeFalsy();

	});

	it('should not crash with invalid code', () => {

		const code = `const a = "bad`;

		const result = CodeValidator.validate(code, test => test
			.declare('const')
			._s
			.id('a')
			._s
			.symbol('=')
			._s
			.string('bad')
			.end());

		expect(result.error).not.toBeFalsy();
		expect(result.error.start).toBe(14);
		expect(result.error.end).toBe(14);
	});

	it('should accurately index positions with newlines', () => {

		const code = `

  const a = "bad`;

		const result = CodeValidator.validate(code, test => test
			.__w
			.declare('const')
			._s
			.id('a')
			._s
			.symbol('=')
			._s
			.string('bad')
			._s
			.eof());

		expect(result.error).not.toBe(null);
		expect(result.error.start).toBe(18);
		expect(result.error.end).toBe(18);
	});
	
	it('should accurately index positions with multi-line comments', () => {

		const code = `/* a
b
c */

  const a = "bad`;

		const result = CodeValidator.validate(code, test => test
			.commentStart('/*')
			.text(` a
b
c `)
			.commentEnd('*/')
			.__w
			.declare('const')
			._s
			.id('a')
			._s
			.symbol('=')
			._s
			.string('bad')
			.end());

		expect(result.error).not.toBe(null);
		expect(result.error.start).toBe(29);
		expect(result.error.end).toBe(29);
	});

	it('should property change start/end index on new lines', () => {

		const code = `a
c`;

		const result = CodeValidator.validate(code, test => test
			.id('a')
			._n
			.id('b')
			.end());

		expect(result.error).not.toBeFalsy();
		expect(result.error.start).toBe(2);
		expect(result.error.end).toBe(2);

	});

	it('work correctly with ! operator', () => {

		const code = `a = !0`;

		const result = CodeValidator.validate(code, test => test
			.id('a')
			._s
			.symbol('=')
			._s
			.symbol('!')
			.number(0)
			.eof());

		expect(result.error).toBeFalsy();

	});

	it('should allow `end` command to process all remaining whitespace and `eof`', () => {

		const code = `a = 100
		
		// skip this comment
		
		`;

		const result = CodeValidator.validate(code, test => test
			.id('a')
			._s
			.symbol('=')
			._s
			.number(100)
			.__w
			.commentStart('//')
			.text(' skip this comment')
			.__w);

		expect(result.error).toBeFalsy();

	});

	it('should work with class definitions', () => {
		const code = `
class Reader {
	read() { }
}`;

		const result = CodeValidator.validate(code, test => test
			
			// class def
			.__w
			.keyword('class')
			._s
			.id('Reader')
			._s
			.symbol('{')

			
			// function def
			._n._t.id('read')
			.symbol('(')
			.symbol(')')
			._s
			.symbol('{')
			._s
			.symbol('}')
			._n

			.symbol('}')
			.eof());

		expect(result.error).toBeFalsy();
	});

	it('should capture symbols', () => {
		const code = `= < > <= >= => == === != !== & && | || << >> >>> ? :`;
		const result = CodeValidator.validate(code, test => test
			.symbol('=')._s
			.symbol('<')._s
			.symbol('>')._s
			.symbol('<=')._s
			.symbol('>=')._s
			.symbol('=>')._s
			.symbol('==')._s
			.symbol('===')._s
			.symbol('!=')._s
			.symbol('!==')._s
			.symbol('&')._s
			.symbol('&&')._s
			.symbol('|')._s
			.symbol('||')._s
			.symbol('<<')._s
			.symbol('>>')._s
			.symbol('>>>')._s
			.symbol('?')._s
			.symbol(':')
			.eof());
		
			expect(result.error).toBeFalsy();
	});

	it('should capture booleans', () => {
		const code = `true false`;
		const result = CodeValidator.validate(code, test => test
			.boolean(true)
			._s
			.boolean(false)
			.eof());
		
			expect(result.error).toBeFalsy();
	});

	it('should capture numbers', () => {
		const code = `300 0.33 0x99`;
		const result = CodeValidator.validate(code, test => test
			.number(300)._s
			.number(0.33)._s
			.number('0x99')
			.eof());
		
			expect(result.error).toBeFalsy();
	});

	it('should capture keywords', () => {
		const code = `break class const let case catch continue debugger default delete do else finally for function if in instanceof new return switch this throw try typeof var void while with`;
		const result = CodeValidator.validate(code, test => test
			.keyword('break')._s
			.keyword('class')._s
			.keyword('const')._s
			.keyword('let')._s
			.keyword('case')._s
			.keyword('catch')._s
			.keyword('continue')._s
			.keyword('debugger')._s
			.keyword('default')._s
			.keyword('delete')._s
			.keyword('do')._s
			.keyword('else')._s
			.keyword('finally')._s
			.keyword('for')._s
			.keyword('function')._s
			.keyword('if')._s
			.keyword('in')._s
			.keyword('instanceof')._s
			.keyword('new')._s
			.keyword('return')._s
			.keyword('switch')._s
			.keyword('this')._s
			.keyword('throw')._s
			.keyword('try')._s
			.keyword('typeof')._s
			.keyword('var')._s
			.keyword('void')._s
			.keyword('while')._s
			.keyword('with')
			.eof());
		
			expect(result.error).toBeFalsy();
	});

	it('should capture ids', () => {
		const code = `a return b`;
		const result = CodeValidator.validate(code, test => test
			.id('a')
			._s
			.keyword('return')
			._s
			.id('b')
			.eof());

		expect(result.error).toBeFalsy();
	});

	it('should not ignore falsy values for arguments', () => {

		// making sure that values like 0 or false aren't treated
		// as null since they fail tests like !arg
		const err1 = CodeValidator.validate(`0`, test => test.number(0).end());
		const err2 = CodeValidator.validate(`false`, test => test.boolean(false).end());

		expect(err1.error).toBeFalsy();
		expect(err2.error).toBeFalsy();

	});

	it('should test declared variables', () => {

		const code = `const a = 100;`;
		const result = CodeValidator.validate(code, test => test
			.declare('const')
			._s
			.id('a')
			._s
			.symbol('=')
			._s
			.number(100)
			.symbol(';')
			.eof());
			
		expect(result.error).toBeFalsy();
	});


// 	it('should accept optional params', () => {

// 		const code = `
// true
// false;
// 		`;
		
// 		const result = CodeValidator.validate(code, test => test
// 			.__w
// 			.boolean(true)
// 			.optional.symbol(';')
// 			._n
			
// 			.boolean(false)
// 			.symbol(';')
// 			.optional._n

// 			.eof());
			
// 		expect(result.error).toBeFalsy();
// 	});


	it('should test multiple declared variables', () => {

		const code = `
const a = 100;
const b = 200;
		`;
		
		const result = CodeValidator.validate(code, test => test
			.__w
			.declare('const')
			._s
			.id('a')
			._s
			.symbol('=')
			._s
			.number(100)
			.symbol(';')
			._n
			
			.declare('const')
			._s
			.id('b')
			._s
			.symbol('=')
			._s
			.number(200)
			.symbol(';')
			.__w
			.eof());
			
		expect(result.error).toBeFalsy();
	});


	it('should allow custom validators', () => {

		let identifier;
		const evaluate = test => test
			.keyword('if')
			._s
			.symbol('(')
			.id('a', 'b', id => { identifier = id; })
			._s
			.symbol('<', '>', symbol =>
				((identifier === 'a' && symbol === '>') || (identifier === 'b' && symbol === '<'))
					&& 'Expected for `a` to be less than `b`'
			)
			._s
			.id('a', 'b', id => identifier === id && `Identifier \`${id}\` has already been used`)
			.symbol(')')
			._s
			.symbol('{')
			._s
			.symbol('}')
			.eof();
		
		identifier = null;
		const ex1 = CodeValidator.validate('if (a < b) { }', evaluate);

		identifier = null;
		const ex2 = CodeValidator.validate('if (a > b) { }', evaluate);

		identifier = null;
		const ex3 = CodeValidator.validate('if (b < a) { }', evaluate);

		identifier = null;
		const ex4 = CodeValidator.validate('if (b < b) { }', evaluate);

		identifier = null;
		const ex5 = CodeValidator.validate('if (a < a) { }', evaluate);
			
		expect(ex1.error).toBe(null);
		expect(ex2.error).not.toBe(null);
		expect(ex3.error).not.toBe(null);
		expect(ex4.error).not.toBe(null);
		expect(ex5.error).not.toBe(null);
	});


	it('should work with for loops', () => {

		const code = `
for (let i = 0; i < 10; i++) {
	break;
	continue;
}
		`;

		const result = CodeValidator.validate(code, test => test
			.__w
			.keyword('for')
			._s
			.symbol('(')

			// init
			.declare('let')
			._s
			.id('i')
			._s
			.symbol('=')
			._s
			.number(0)
			.symbol(';')

			// condition
			._s
			.id('i')
			._s
			.symbol('<')
			._s
			.number(10)
			.symbol(';')

			// iterator
			._s
			.id('i')
			.symbol('++')
			.symbol(')')

			// loop block
			._s
			.symbol('{')
			._n

			// loop keyword
			._t
			.keyword('break')
			.symbol(';')
			._n

			// loop keyword
			._t
			.keyword('continue')
			.symbol(';')
			._n

			// loop block close
			.symbol('}')
			.__w
			.eof());

		expect(result.error).toBeFalsy();

	});


	it('should allow stateful validation', () => {

		const code = `
const a = 100;
console.log(b);
		`;

		let varname;

		const result = CodeValidator.validate(code, test => {
			test
				.__w
				.declare('const')
				._s
				.id('a', 'b', 'c', id => { varname = id; })

			test
				._s
				.symbol('=')
				._s
				.number(100)
				.symbol(';')
				._n
				.id('console')
				.symbol('.')
				.id('log')
				.symbol('(')
				.id(varname)
				.symbol(')')
				.symbol(';')
				.__w
				.eof();
		});

		expect(result.error.message).toBe('Expected identifier: `a`');

	});


// 	it('should let the validator be optional by default', () => {
		
// 		let name;
// 		let value;

// 		// both of these validators are logging data but not
// 		// returning a value -- the lack of a response means
// 		// that it doesn't control validation flow
// 		const result = CodeValidator.validate(`a = 100`, test => {
// 			test
// 				.start()
// 				.id('b', 'a', id => { name = id; })
// 				.symbol('=')
// 				.number(200, 100, num => { value = num; })
// 				.end();
// 		});

// 		expect(result.error).toBeFalsy();
// 		expect(name).toBe('a');
// 		expect(value).toBe(100);
		
// 	});


	it('should work with arrow functions', () => {

		const result = CodeValidator.validate(`read = () => { }`, test => test
			.id('read')
			._s
			.symbol('=')
			._s
			.symbol('(')
			.symbol(')')
			._s
			.symbol('=>')
			._s
			.symbol('{')
			._s
			.symbol('}')
			.eof());

		expect(result.error).toBeFalsy();

	});


	it('should work with ternary operators', () => {

		const result = CodeValidator.validate('test = true ? 1 : 2;', test => test
			.id('test')
			._s
			.symbol('=')
			._s
			.boolean(true)
			._s
			.symbol('?')
			._s
			.number(1)
			._s
			.symbol(':')
			._s
			.number(2)
			.symbol(';')
			.end());

		expect(result.error).toBeFalsy();

	});


	it('should work with arrays', () => {

		const result = CodeValidator.validate(`items[0] = [ 1, 2, 3 ][1]`, test => test
			.id('items')
			.symbol('[')
			.number(0)
			.symbol(']')
			._s
			.symbol('=')
			._s
			.symbol('[')
			._s
			.number(1)
			.symbol(',')
			._s
			.number(2)
			.symbol(',')
			._s
			.number(3)
			._s
			.symbol(']')
			.symbol('[')
			.number(1)
			.symbol(']')
			.end());

		expect(result.error).toBeFalsy();

	});


	it('should work with string getters', () => {

		const result = CodeValidator.validate(`name = obj['prop']`, test => test
			.id('name')
			._s
			.symbol('=')
			._s
			.id('obj')
			.symbol('[')
			.string('prop')
			.symbol(']')
			.eof());

		expect(result.error).toBeFalsy();
	});


	describe('it should evaluate comments', () => {

		it('track simple comments', () => {

			const code = `
// set a to 100
a = 100;`

			const result = CodeValidator.validate(code, test => test
				.__w
				.commentStart('//')
				.text(' set a to 100')
				._n
				.id('a')
				._s
				.symbol('=')
				._s
				.number(100)
				.symbol(';')
				.end());

			expect(result.error).toBeFalsy();

		});

	});


	describe('it should correctly track error indexes', () => {

		it('should handle simple single variable', () => {
			
			const code = `
      
a`;
			
			const result = CodeValidator.validate(code, test => test
				.__w
				.id('b')
				.eof());
			
			expect(result.error.message).toBe('Expected identifier: `b`');
			// expect(result.error.line).toBe(2);
			expect(result.error.start).toBe(8);
			expect(result.error.end).toBe(8);
			
		});


		it('should handle positions deeper inside a single line', () => {

			const code = `
  a      false`;

			const result = CodeValidator.validate(code, test => test
				.__w
				.id('a')
				.__s
				.boolean(true)
				.eof());

			expect(result.error).not.toBe(null);
			// expect(result.error.line).toBe(1);
			expect(result.error.start).toBe(10);
			expect(result.error.end).toBe(15);

		});


		it('should handle comments and indexes', () => {

			const code = `
// this is a simple comment
  a      false`;

			const result = CodeValidator.validate(code, test => test
				.__w
				.commentStart('//')
				.text(' this is a simple comment')
				._n
				.__s
				.id('a')
				.__s
				.boolean(true)
				.eof());

			expect(result.error).not.toBe(null);
			// expect(result.error.line).toBe(2);
			expect(result.error.start).toBe(38);
			expect(result.error.end).toBe(43);

		});


		it('should handle block comments', () => {

			const code = `a = /* comment */ 200`;

			const result = CodeValidator.validate(code, test => test
				.id('a')
				._s
				.symbol('=')
				._s
				.commentStart('/*')
				._s
				.text('comment')
				._s
				.commentEnd('*/')
				._s
				.number(100)
				.eof());


			expect(result.error).not.toBe(null);
			// expect(result.error.line).toBe(0);
			expect(result.error.start).toBe(18);
			expect(result.error.end).toBe(21);

		});

		it('should handle multi-line block comments', () => {

			const code = `a /* 111
222
333 */
c`;

			const result = CodeValidator.validate(code, test => test
				.id('a')
				._s
				.commentStart('/*')
				._s
				.text(`111
222
333`)
				._s
				.commentEnd('*/')
				._n
				.id('b'))


			expect(result.error).not.toBe(null);
			expect(result.error.start).toBe(20);
			expect(result.error.end).toBe(20);

		});

	});

});