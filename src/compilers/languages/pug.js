
import $fsx from 'fs-extra';
import $pug from 'pug';
import BaseCompiler, { CompilerOptions, createServerError } from "./base";

export default class PugCompiler extends BaseCompiler {

	/** Handles compiling a Pug file
	 * @param {CompilerOptions} options The options for compiler generation
	 */
	async compile(options) {
		return new Promise((resolve) => {
			const config = { };

			// renders the Pug file
			$pug.renderFile(options.source, config, async (err, data) => {
				if (err) {
					const debug = getDebugInfo(options.localPath, err);
					return resolve({ success: false, error: debug });
				}
				
				// write the resulting file
				try {
					await $fsx.outputFile(options.destination, data);
					resolve({ success: true });
				}
				catch (err) {
					log.ex('compilers/languages/pug.js', err);
					resolve({
						success: false,
						error: createServerError(options.localPath)
					});
				}
			});
		});
	}

}

// more refined hints to help users
const HINTS = {
	'PUG:NO_END_BRACKET': `This message normally means you used a square bracket for an inline tag, but didn't close it at the end`
};

// extract error information from the compile attempt
function getDebugInfo(path, err) {
	return {
		file: path,
		line: err.line,
		column: err.column,
		message: err.msg,
		detail: err.toString(),
		hint: HINTS[err.code]
	};
}