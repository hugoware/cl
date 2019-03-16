
import CodeValidator from '../../validation/code-validator';
import HtmlValidator from '../../validation/html-validator';
import CssValidator from '../../validation/css-validator';

export default class ValidationAPI {

	constructor(lesson) {
		this.lesson = lesson;
	}

	js = CodeValidator.validate
	html = HtmlValidator.validate
	css = CssValidator.validate

}