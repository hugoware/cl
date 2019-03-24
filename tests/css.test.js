import _ from 'lodash';
import CssValidator from '../src/client/app/validation/css-validator';

describe('CssValidator', () => {

	it('should capture basic rules', () => {
		const code = `html {
	background: blue;
}`;

		const result = CssValidator.validate(code, test => test
			.selector('html')
			.block()
			._t.prop('background')._s$.symbol(':')._s.color('blue').symbol(';')._n
			.endBlock());

		expect(result.error).toBe(null);
	});

	it('should capture multiple basic declarations', () => {

		const code = `html {
	width: 100px;
	background: blue;
}`;

		const result = CssValidator.validate(code, test => test
			.selector('html')
			.block()
			.declare([
				['width', '100px'],
				['background', 'blue'],
			])
			._n
			.endBlock());

		expect(result.error).toBe(null);

	});

	it('should capture internal value checks declarations', () => {

		const code = `html {
	shadow: 10px 10px black;
	background: blue;
}`;

		const result = CssValidator.validate(code, test => test
			.selector('html')
			.block()
			.declare([
				['shadow', t => t.px('10px')._s.px('10px')._s.color('black'), _.noop],
				['background', 'red', 'green', 'blue'],
			])
			._n
			.endBlock());

		expect(result.error).toBe(null);

	});

	it('should care about sequence when asked', () => {

		const code = `html {
	font-weight: bold;
	font: 10px arial;
}`;

		const irrelevant = CssValidator.validate(code, test => test
			.selector('html')
			.block()
			 .declare([
				['font', '10px arial'],
				['font-weight', 'bold'],
			])
			._n
			.endBlock());

		const significant = CssValidator.validate(code, test => test
			.selector('html')
			.block()
			.matchPropOrder.declare([
				['font', '10px arial'],
				['font-weight', 'bold'],
			])
			._n
			.endBlock());

		expect(irrelevant.error).toBe(null);
		expect(significant.error).not.toBe(null);
		expect(significant.error.message).toBe("Expected property name: `font`");

	});

	it('not capture invalid prop names', () => {

		const code = `html {
	fonts: 10px arial;
}`;

		const result = CssValidator.validate(code, test => test
			.selector('html')
			.block()
			 .declare([
				['font', '10px arial'],
			])
			._n
			.endBlock());

		expect(result.error).not.toBe(null);
		expect(result.error.message).toBe('Expected property name: `font`')
	});

	it('should work with quotes - 1', () => {

		const code = `html {
	font: 10px 'arial fancy';
}`;

		const result = CssValidator.validate(code, test => test
			.selector('html')
			.block()
			 .declare([
				['font', t => t.px('10px')._s.quote("'").font('arial fancy').endQuote(), _.noop],
			])
			._n
			.endBlock());

		expect(result.error).toBe(null);
	});

	it('should work with quotes - 2', () => {

		const code = `html {
	font: 10px "arial fancy";
}`;

		const result = CssValidator.validate(code, test => test
			.selector('html')
			.block()
			 .declare([
				['font', t => t.px('10px')._s.quote('"').font('arial fancy').endQuote(), _.noop],
			])
			._n
			.endBlock());

		expect(result.error).toBe(null);
	});

	it('should work with quotes - 3', () => {

		const code = `html {
	font: 10px "arial fancy';
}`;

		const result = CssValidator.validate(code, test => test
			.selector('html')
			.block()
			 .declare([
				['font', t => t.px('10px')._s.quote('"').font('arial fancy').endQuote(), _.noop],
			])
			._n
			.endBlock());

		expect(result.error).not.toBe(null);
		expect(result.error.message).toBe('Expected closing quote: `"`')
	});

});
