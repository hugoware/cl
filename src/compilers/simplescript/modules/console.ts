

const Console = { };

Console.ask = async prompt => {
	return new Promise(resolve => {
		__CODELAB__.consolePrompt(prompt, resolve);
	});
};

Console.clear = async (...args) => {
	__CODELAB__.consoleClear(...args);
};

Console.log = async (...args) => {
	__CODELAB__.consoleLog(...args);
};

Console.warn = async (...args) => {
	__CODELAB__.consoleWarn(...args);
};

Console.success = async (...args) => {
	__CODELAB__.consoleSuccess(...args);
};

Console.info = async (...args) => {
	__CODELAB__.consoleInfo(...args);
};

Console.error = async (...args) => {
	__CODELAB__.consoleError(...args);
};