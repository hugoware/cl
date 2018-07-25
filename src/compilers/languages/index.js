
import $path from '../../path';
import BaseCompiler from './base';
import ScssCompiler from './scss';
import PugCompiler from './pug';
import TypeScriptCompiler from './typescript';

/** Handles finding an appropriate compiler for a file type
 * @param {string} path The file to base the compiler on
 * @returns {BaseCompiler} A relevant compiler, if any
*/
export default function getCompiler(path) {
	const ext = $path.extalias(path);
	switch (ext) {
		case 'scss': return new ScssCompiler();
		case 'sass': return new ScssCompiler();
		case 'pug': return new PugCompiler();
		case 'jade': return new PugCompiler();
		case 'ts': return new TypeScriptCompiler();
	}
}