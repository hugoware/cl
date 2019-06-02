import { _, runTests } from './lib';
import { randomString, randomNumber } from './utils';


export default function execute(file, callback) {

	// setup the return result
	const result = {
		scoreRequests: 0
	};

	const state = { 
	};
	
	const studentName = randomString(10);
	const scoreValues = [ 
		randomNumber(25, 100),
		randomNumber(25, 100),
		randomNumber(25, 100),
		randomNumber(25, 100),
		randomNumber(25, 100)
	];

	const scoreAverage = (
		scoreValues[0] +
		scoreValues[1] +
		scoreValues[2] +
		scoreValues[3] +
		scoreValues[4]) / 5;

	const expectedGrade = scoreAverage >= 100 ? 'A++'
		: scoreAverage >= 90 ? 'A'
		: scoreAverage >= 80 ? 'B'
		: scoreAverage >= 70 ? 'C'
		: 'F';


	runTests({
		file,

		// setup the run state
		onInit(runner) {
			const showGradeKey = randomString(10, '__showGrade__');

			runner.inject += `

				// required before testing functions
				var hasFunction = !/null|undefined/i.test(typeof showGrade);
				${runner.key}({ hasShowGradeFunction: hasFunction });

				if (hasFunction) {
					${runner.key}({ showGradeArgumentCount: showGrade.length });

					// replace the function
					var ${showGradeKey} = showGrade;
					showGrade = function(arg1) {
						${runner.key}({ showGradeArg1: arg1 });
						${showGradeKey}.apply(null, arguments);
					}

					${runner.key}({ isExpectingGrade: 'A++' });
					${runner.key}({ showGradePassedArg1: 100 });
					showGrade(100);
					${runner.key}({ showGradePassedArg1: 101 });
					showGrade(101);

					${runner.key}({ isExpectingGrade: 'A' });
					${runner.key}({ showGradePassedArg1: 90 });
					showGrade(90);
					${runner.key}({ showGradePassedArg1: 91 });
					showGrade(91);

					${runner.key}({ isExpectingGrade: 'B' });
					${runner.key}({ showGradePassedArg1: 80 });
					showGrade(80);
					${runner.key}({ showGradePassedArg1: 81 });
					showGrade(81);

					${runner.key}({ isExpectingGrade: 'C' });
					${runner.key}({ showGradePassedArg1: 70 });
					showGrade(70);
					${runner.key}({ showGradePassedArg1: 71 });
					showGrade(71);

					${runner.key}({ isExpectingGrade: 'F' });
					${runner.key}({ showGradePassedArg1: 69 });
					showGrade(69);
					${runner.key}({ showGradePassedArg1: -100 });
					showGrade(-100);

					${runner.key}({ isExpectingGrade: false });
				}

			`;

		},

		onError(runner, ex) {
			callback(ex, { });
		},

		onDone(runner) {
			result.hasShowGradeFunction = state.hasShowGradeFunction;
			result.showGradeFunction = state.showGradeFunction;
			result.showGradeArgumentCount = state.showGradeArgumentCount;
			callback(null, result);
		},

		tests: [

			// // make sure there's a function 
			// function(runner) {
			// }

		],

		// setup the configuration
		config: {

			onError: function(ex) {
				result.hasException = true;
				result.exception = ex;
			},

			// update state info
			onSyncState(update) {
				_.assign(state, update);
			},

			// watching for questions
			onConsoleAsk: function(message) {

				// looking for a name
				if (/name/i.test(message)) {
					result.didAskForName = true;
					return studentName;
				}

				// looking for a score
				if (/score/.test(message)) {
					const num = (0 | message.replace(/[^0-9]/g, ''));
					result[`didAskForScore${num}`] = true;
					return scoreValues[num - 1];
				}

			},

			// handle alerts
			onConsoleAlert: function(message) { },

			// check for printing results
			onConsoleLog: function(message) {

				// check if printing grades
				if (state.isExpectingGrade) {
					const propToCheck = state.isExpectingGrade === 'A++' ? 'didDisplayGradeAPlusPlus'
						: state.isExpectingGrade === 'A' ? 'didDisplayGradeA'
						: state.isExpectingGrade === 'B' ? 'didDisplayGradeB'
						: state.isExpectingGrade === 'C' ? 'didDisplayGradeC'
						: state.isExpectingGrade === 'F' ? 'didDisplayGradeF'
						: null;

					// checking props
					if (propToCheck && (!(propToCheck in result) || result[propToCheck] === true)) {
						result[propToCheck] = message === state.isExpectingGrade
							&& state.showGradePassedArg1 === state.showGradeArg1;
					}

				}

				// score must match
				if (scoreAverage === message || (0|message) === (0|scoreAverage))
					result.didPrintAverage = true;

				// did use the correct one
				if (message === expectedGrade) {
					result.didPrintGrade = true;
				}

				if (message === studentName)
					result.didPrintStudentName = true;

			}

		}

	});


}

