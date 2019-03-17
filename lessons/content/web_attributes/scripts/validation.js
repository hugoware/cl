import { _ } from './lib';

export const first_src = test => test
	.__w$
	.open('img')
	._s
	.attrs([
		[ 'src', '/cat.png']
	])
	._s$
	.close('/>')
	._n
	.__w$;


export const multiple_images = test => {

	// add the cat image
	test.merge(first_src);

	// validators per collection
	const validate = match => {
		const index = allowed.indexOf(match);
		allowed.splice(index, 1);
	};

	// check for the remaining two
	const allowed = [
		'/bear.png', '/bunny.png', '/fox.png', '/owl.png',
	];

	// only allow two matches
	for (let i = 0; i < 2; i++) {
		test.open('img')
			._s
			.attrs([
				[ 'src', ...allowed, validate ]
			])
			._s$
			.close('/>')
			._n
			.__w$;
	}

}


export const multiple_images_with_sizes = test => {

	// validators per collection
	const validate = match => {
		const index = allowed.indexOf(match);
		allowed.splice(index, 1);
	};

	// dont' get too big
	const validateNumberSize = num => {
		const value = 0 | num;
		if (isNaN(value) || value < 100 || value > 200)
			return `Expected a number between 100 and 200`;
	};

	// check for the remaining two
	const allowed = [
		'/cat.png',
		'/bear.png',
		'/bunny.png',
		'/fox.png',
		'/owl.png',
	];

	test.__w$;

	// only allow two matches
	for (let i = 0; i < 3; i++) {
		test.open('img')
			._s
			.attrs([
				[ 'height', /^[0-9]{3}/, 'Expected number between 100 and 200', validateNumberSize ],
				[ 'width', /^[0-9]{3}/, 'Expected number between 100 and 200', validateNumberSize ],
				[ 'src', allowed, value => {
					const index = _.indexOf(allowed, value);
					allowed.splice(index, 1);
				}]
			])
			._s$
			.close('/>')
			._n
			.__w$;
	}

}

export const input_only = test => test
	.merge(multiple_images_with_sizes)
	.open('input')
	._s
	.close('/>')
	.__w$;

export const input_readonly = test => test
	.merge(multiple_images_with_sizes)
	.open('input')
	._s
	.attrs([
		[ 'readonly' ]
	])
	._s
	.close('/>');



