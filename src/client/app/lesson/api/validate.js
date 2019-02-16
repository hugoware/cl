
import { CodeValidator, CssValidator, HtmlValidator } from '../../lib';

export default class ValidationAPI {

	constructor(lesson) {
		this.lesson = lesson;
	}

	js = CodeValidator.validate
	html = HtmlValidator.validate
	css = CssValidator.validate

}