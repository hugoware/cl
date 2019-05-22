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
		randomNumber(25, 75),
		randomNumber(25, 75),
		randomNumber(25, 75),
		randomNumber(25, 75),
		randomNumber(25, 75)
	];

	const scoreAverage = (
		scoreValues[0] +
		scoreValues[1] +
		scoreValues[2] +
		scoreValues[3] +
		scoreValues[4]) / 5;


	runTests({
		file,

		// setup the run state
		onInit(runner) {

			runner.inject += `

				// required before testing functions
				var hasFunction = !/null|undefined/i.test(typeof showGrade);
				${runner.key}({ hasShowGradeFunction: hasFunction });

				if (hasFunction) {
					${runner.key}({ showGradeArgumentCount: showGrade.length });

					${runner.key}({ isExpectingGrade: 'A++' });
					showGrade(100);

					${runner.key}({ isExpectingGrade: 'A' });
					showGrade(90);

					${runner.key}({ isExpectingGrade: 'B' });
					showGrade(80);

					${runner.key}({ isExpectingGrade: 'C' });
					showGrade(70);

					${runner.key}({ isExpectingGrade: 'F' });
					showGrade(69);

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

					if (state.isExpectingGrade === 'A++')
						result.didDisplayGradeAPlusPlus = message === 'A++';
					else if (state.isExpectingGrade === 'A')
						result.didDisplayGradeA = message === 'A';
					else if (state.isExpectingGrade === 'B')
						result.didDisplayGradeB = message === 'B';
					else if (state.isExpectingGrade === 'C')
						result.didDisplayGradeC = message === 'C';
					else if (state.isExpectingGrade === 'F')
						result.didDisplayGradeF = message === 'F';

					return;
				}



				// score must match
				if (scoreAverage === message || (0|message) === (0|scoreAverage))
					result.didPrintAverage = true;

				if (/^(A\+?|B|C|F)$/.test(message))
					result.didPrintGrade = true;

				if (message === studentName)
					result.didPrintStudentName = true;

			}

		}

	});


}

