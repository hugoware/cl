
importScripts('/__codelab__/typescript/typescriptServices.js');
// import $ts from 'typescript/lib/typescriptServices';
import $lfs from '../app/lfs';
import applyCompatibilityFixes from '../../compilers/compatibility';

// handle incoming messages
self.onmessage = async (msg) => {
	const command = msg.data[0];

	// check for the work to perform
	if (command === 'compile')
		compileFile(msg.data[1]);
};

// handles standard compiling of pug files
async function compileFile(file) {
	let content = await $lfs.read(file);


	content = content.replace(/IO\.read/, match => {
		return `await IO.read`;
	});

// 	content = content.replace(/(IO\.read)/g, match => {
// 		return `await ${match}`;
// 	});

// 	content = `

// const IO = { };
// IO.read = async function(message) {
// 	return new Promise(resolve => {
// 		setTimeout(() => resolve('ok'), 200);
// 	});
// }
	
// ${content}`

// 	// force extra processing
// 	content = content.replace(/class +/gi, 'class ___CODELAB___');
		
	// prepare the code
	let code = ts.transpile(content, {
		noResolve: true,
		strictFunctionTypes: true,
		removeComments: true,
		target: 'ES2015',
		lib: 'ES2015'
	});

// 	const types = { };

// 	// update the code
// 	code = code.replace(/function ___CODELAB___[^\(]+/, match => {
// 			return `var instance = { };\n\ninstance.$ctor = function $ctor`;
// 		})
// 		// each prototype method
// 		.replace(/___CODELAB___[^\.]+\.prototype/g, match => {
// 			return `instance`;
// 		})
// 		// the class init start
// 		.replace(/var ___CODELAB___[^\=]+\=[^\n]+/g, match => {
// 			match = match.replace(/\=.*/, '').substr(17).replace(/(^ ?| ?$)/g, '').trim();
// 			types[match] = true;
// 			return `var ${match} = { };\n${match}.create = function ${match}() {`
// 		})
// 		// the end of the function call
// 		.replace(/return ___CODELAB___[^\n]+\n[^\n]+/, 'instance.$ctor.apply(instance, arguments);\nreturn instance;\n};');

// 	// // replace all instances


// // 	code = `
// // var $ctor = function(instance) {
// // 	if ('$ctor' in instance)
// // 		instance.$ctor.apply(instance, [].slice.call(arguments, 1));
// // };

// // ${code}`;

console.log(code);

// for (const id in types) {
// 	const exp = new RegExp(` new ${id}( |\\()`, 'g');
// 	code = code.replace(exp, ` ${id}.create(`);
// }

// code = code.replace(/\n ?function ?[^\(]+/g, match => {
// 	return `\nvar ${match.substr(9)} = function`;
// });

// 	code = `
// var Calculator = eval('function () {
// 	function Calculator() {
// 			console.log('const');
// 			this.clear();
// 	}
// 	Calculator.prototype.add = function (value) {
// 			this.current += value;
// 	};
// 	Calculator.prototype.subtract = function (value) {
// 			this.current -= value;
// 	};
// 	Calculator.prototype.clear = function () {
// 			this.current = 0;
// 	};
// 	return Calculator;
// });

// var calculator = new Calculator();
// calculator.add(10);
// calculator.subtract(3);
// console.log('is', calculator.current);
// `;
// 	console.log('compiled to', code);

	// config sass
	const options = {
		// sourceMapFile: null,
		// sourceMapRoot: null,
		// sourceMapContents: false
	};

	// generate the CSS
	// const messages = $htmlhint.verify(html, options);
	// const hasErrors = (0 | ((messages || []).length)) > 0;

	let hasErrors = false;

	// compiled successfully
	if (!hasErrors)
		self.postMessage(['compile:ok', { success: true, content: code }]);

	// there was an error
	else {

		// since there can be many errors we want to be
		// able to post multiple messages -- refactor later
		// const errors = [ ];
		for (const message of messages) {

			// make sure it's an error
			if (message.type !== 'error') continue;

			// take the error
			self.postMessage(['compile:ok', {
				content: code,
				error: {
					error: true,
					line: message.line,
					column: message.col,
					message: message.message,
					hint: message.rule ? message.rule.id : null,
					path: file
				}
			}]);
		}

	}

}

// notify this has been loaded
self.postMessage(['load:ok']);