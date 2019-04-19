
import { _ } from './lib';


export const validate_call_func = (test, options) => {
	test.func('showAnimalSound')
		.symbol('(');

	if (options.arg)
		test.string(options.arg)

	test.symbol(')')
		.symbol(';');
}

export const validate_start_function = (test, options) => {
	test.keyword('function')
		._s
		.id('showAnimalSound')
		.symbol('(')

	if (options.includeArgument)
		test.arg('animal');

	test.symbol(')')
		._s
		.symbol('{')
};

export const validate_end_function = test =>
	test.symbol('}');



export const validate_declare_animal = (test, options = { }) => {

	// get the valid animal options
	const animals = ['dog', 'cat', 'mouse'];
	if (options.except) {
		animals.splice(animals.indexOf(options.except), 1);
	}

	if (options.insideFunction)
		test.tab();

	// declare the variable
	test
		.declare('let')
		._s
		.id(options.variableName)
		._s
		.symbol('=')
		._s
		.string(...animals, id => {
			test.append({ [`${options.variableName}Variable`]: id });
		})
		.symbol(';');

};


export const validate_list = (test, options) => {

	// get the options
	const { insideFunction } = options;
	const names = _.keys(options.animals);
	const sounds = _.values(options.animals);
	const soundArgs = _.map(sounds, (sound, index) => `${names[index]} says ${sound}`);
	const total = names.length;

	// check each animal
	_.times(total, index => {
		let isFirst = index === 0;
		let isLast = (index + 1) === total;
		let expectsSound;
		let removeAt;

		// nudge over inside of a function
		if (insideFunction)
			test.tab();

		// create the if statement
		if (isFirst) test.keyword('if')
		else test.keyword('else')._s.keyword('if');

		// create the comparison
		test._s
			.symbol('(')
			.id('animal')
			._s
			.symbol('===')
			._s
			.string(...names, match => {
				removeAt = names.indexOf(match);
				expectsSound = soundArgs[removeAt];
			})
			.symbol(')')
			._s
			.symbol('{')
			._n;

		// extra tab for function
		if (insideFunction)
			test.tab();

		// nudge inward for the message
		test._t
			.id('console')
			.symbol('.')
			.func('log')
			.symbol('(')
			.string(expectsSound, match => {
				names.splice(removeAt, 1);
				sounds.splice(removeAt, 1);
				soundArgs.splice(removeAt, 1);
			})
			.symbol(')')
			.symbol(';')
			._n;

		if (insideFunction)
			test.tab();

		// closing brace
		test.symbol('}');

		// finishing up
		if (!isLast)
			test._n.lines(1);
	});
	
	// finally, include the else
	test.clearBounds()
		._n.lines(1);

	// tab first
	if (insideFunction)
		test.tab();

	// else keyword
	test.keyword('else')
		._s
		.symbol('{')
		._n;

	// extra tab, if needed
	if (insideFunction)
		test.tab();

	// logging message
	test._t
		.id('console')
		.symbol('.')
		.func('log')
		.symbol('(')
		.string('not sure')
		.symbol(')')
		.symbol(';')
		._n;

	// closing the brace
	if (insideFunction)
		test.tab();

	test.symbol('}');

};
