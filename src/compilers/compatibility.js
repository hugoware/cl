
/** rewrites code to be compatible with debuggerjs */
export default function applyCompatibilityFixes(code) {

	// just cheat with a regex for now
	code = code.replace(/[^=] ?function ?[^\( ]+\(/, match => {
		match = match.replace(/^.*function/, '')
			.replace(/\($/g, '');
		return `var ${match} = function(`;
	});

	return code;

}