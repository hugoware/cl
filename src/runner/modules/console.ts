

const Console = { };

Console.ask = prompt => {
	return new Promise(resolve => {
		__CODELAB__.prompt(prompt, resolve);
	});
};

Console.log = async (...args) => {
	console.log(...args);
};
