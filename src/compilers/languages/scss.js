
import $sass from 'node-sass';
import $fsx from 'fs-extra';
import BaseCompiler, { CompilerOptions , createServerError } from "./base";

export default class ScssCompiler extends BaseCompiler {

	/** Handles generation a sass/scss file 
	 * @param {CompilerOptions} options The options used for generating a file 
	 * */
	async compile(options) {
		return new Promise(async (resolve) => {

			const config = {
				file: options.source
			};

			$sass.render(config, async (err, result) => {
				if (err) {
					const debug = getDebugInfo(options.localPath, err);
					return resolve({ success: false, error: debug });
				}
				
				// write the resulting file
				try {
					const data = result.css.toString();
					await $fsx.outputFile(options.destination, data);
					resolve({ success: true });
				}
				catch (err) {
					resolve({
						success: false,
						error: createServerError(options.localPath)
					});
				}

			});
		});
	}

}

// gets hints for error messages
function getHint(msg) {
	if (/expected \d selector/i.test(msg))
		return `Seems like you're missing a semi-colon at the end of a rule definition`;
}

// extract error information from the compile attempt
function getDebugInfo(path, err) {
	return {
		file: path, 
		line: err.line,
		column: err.column,
		message: err.message,
		detail: err.formatted,
		hint: getHint(err.message)
	};
}