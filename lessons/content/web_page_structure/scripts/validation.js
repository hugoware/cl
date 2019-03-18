

export const validate_doctype = test => test
	.__w$
	.doctype('html')
	._n;

export const validate_html = test => test
	.merge(validate_doctype)
	.tag('html')
	._n
	._n
	.close('html');

export const start_of_doc = test => test
	.merge(validate_doctype)
	.tag('html');

export const end_of_doc = test => test
	.close('html');

export const validate_empty_head = test => test
	._t.tag('head')._n
	._t$._t$._n
	._t.close('head')

export const validate_empty_body = test => test
	._t.tag('body')._n
	._t$._t$._n
	._t.close('body')

export const validate_title = test => test
	._t.tag('title').content(5, 25).close('title')._n;
