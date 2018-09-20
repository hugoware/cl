
import consoleModule from './console.ts';

const $modules = { 
	console: consoleModule
};

export default function importModules(code) {

	const imported = { };
	const lines = code.split(/\n/);
	for (let i = 0, total = lines.length; i < total; i++) {

		const line = lines[i];
		if (!/^ ?import +(\"|\')[a-zA-Z\-\_]+(\"|\') ?; ?$/.test(line))
			continue;

		// since it's an import, get the module
		const module = line.replace(/^ ?import/, '')
			.replace(/[^a-zA-Z\-\_]/g, '');

		// check if already imported
		if (imported[module]) {
			lines[i] = `console.warn("module ${module} already imported");`;
			continue;
		}

		// check if this is a real module
		const replacement = $modules[module];
		if (!replacement) {
			lines[i] = `throw "Module ${module} not found`;
			continue;
		}

		// since it's there, replace it and save it
		imported[module] = true;
		lines[i] = replacement;

	}

	return lines.join('\n');
}