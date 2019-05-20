const lib = window.__CODELAB_LIBS__;

export const _ = lib._;
export const $ = lib.$;
export const CodeValidator = lib.CodeValidator;
export const HtmlValidator = lib.HtmlValidator;
export const CssValidator = lib.CssValidator;
export const createTestRunner = lib.createTestRunner;
export const validateHtmlDocument = lib.HtmlValidationHelper.validate;
export const runTests = lib.runTests;


$.preview = function() {
	return $('#preview .output').contents();
};


export default { 
	_, $,
	CodeValidator,
	HtmlValidator,
	CssValidator,
	createTestRunner,
	runTests,
	validateHtmlDocument,
};