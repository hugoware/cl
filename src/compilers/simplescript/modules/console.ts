

const Console = { };

Console.ask = async prompt => {
	return new Promise(resolve => {
		__CODELAB__.consolePrompt(prompt, resolve);
	});
};

Console.log = async (...args) => {
	__CODELAB__.consoleLog(...args);
};

Console.warn = async (...args) => {
	__CODELAB__.consoleWarn(...args);
};

Console.error = async (...args) => {
	__CODELAB__.consoleError(...args);
};