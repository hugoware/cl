

export const validate_all_headings = test => {
	const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

	// capture each heading
	const heading = sub => {
		
		// the heading in this test
		let current;

		// captures and validates the heading used
		const capture = tag => {
			current = tag;

			// remove the allowed tag
			const index = headings.indexOf(tag);
			headings.splice(index, 1);
		};

		// check the tag
		sub.__w$
			.tag(...headings.concat(capture))
			.append({ inTag: true })
			.singleLine.content(5, 20)
			.close(current)
			.append({ inTag: false })
			._n
			.__w$
	};

	// check each heading
	return test
		.merge(heading)
		.merge(heading)
		.merge(heading)
		.merge(heading)
		.merge(heading)
		.merge(heading);

}

export const validate_single_line_paragraph = test => test
	.tag('p')
	.append({ inTag: true })
	.singleLine.content(5, 25)
	.close('p')
	.append({ inTag: false })
	._n
	.__w$;

export const validate_multi_line_paragraph = test => test
	.tag('p')._n
	._t.singleLine.content('line number 1')._n
	._t.singleLine.content('line number 2')._n
	.close('p')
	._n
	.__w$;

export const validate_multi_line_paragraph_with_break = test => test
	.tag('p')._n
	._t.singleLine.content('line number 1')._n
	._t.open('br')._s$.close('/>')._n
	._t.singleLine.content('line number 2')._n
	.close('p')
	._n
	.__w$;

export const validate_multiple_paragraphs = test => test
	.tag('p')
	.append({ inTag: true })
	.singleLine.content('line number 1')
	.close('p')
	.append({ inTag: false })
	._n
	.tag('p')
	.append({ inTag: true })
	.singleLine.content('line number 2')
	.close('p')
	.append({ inTag: false })
	._n
	.__w$;
