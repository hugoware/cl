

export const first_src = test => test
	.__w$
	.open('img')
	._s
	.attr({ src: '/cat.png' })
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
			.attrs('src', ...allowed, validate)
			._s$
			.close('/>')
			._n
			.__w$;
	}

	// don't allow anymore
	test.eof();
}


export const multiple_images_with_sizes = test => {

	// validators per collection
	const validate = match => {
		const index = allowed.indexOf(match);
		allowed.splice(index, 1);
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
				[ 'height', /^[0-9]{3,4}/, 'Expected number' ],
				[ 'width', /^[0-9]{3,4}/, 'Expected number' ],
				[ 'src', '/cat.jpg', 'dog.jpg' ]
			])
			._s$
			.close('/>')
			._n
			.__w$;
	}

	// don't allow anymore
	test.eof();
}
