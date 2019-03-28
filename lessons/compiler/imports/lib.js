const lib = window.__CODELAB_LIBS__;

export const _ = lib._;
export const $ = lib.$;
export const CodeValidator = lib.CodeValidator;
export const HtmlValidator = lib.HtmlValidator;
export const CssValidator = lib.CssValidator;


$.preview = function() {
	return $('#preview .output').contents();
};


export default { 
	_, $,
	CodeValidator,
	HtmlValidator,
	CssValidator,
};