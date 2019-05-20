import { _, runTests } from './lib';
import { randomString, randomNumber } from './utils';


export default function execute(file, callback) {
	
	// setup the return result
	const result = { };
	result.studentName = randomString(10);

	result.scoreRequests = 0;
	result.scoreValues = [ 
		randomNumber(25, 75),
		randomNumber(25, 75),
		randomNumber(25, 75),
		randomNumber(25, 75),
		randomNumber(25, 75)
	];

	result.scoreAverage = (
		result.scoreValues[0] +
		result.scoreValues[1] +
		result.scoreValues[2] +
		result.scoreValues[3] +
		result.scoreValues[4]) / 5;


	runTests({
		file,

		// setup the run state
		onInit(runner) {

			runner.inject += `\n\nshowAverage("${result.studentName}");\n\n`;

		},

		onError(runner, ex) {
			callback(ex, { });
		},

		onDone(runner) {


			callback(null, result);
		},

		tests: [

			function(runner) {
				result.didExec = true;
			}

		],

		// setup the configuration
		config: {

			onError: function(ex) {
				result.hasException = true;
				result.exception = ex;
			},

			// watching for questions
			onConsoleAsk: function(message) {

				// asked for a name
				if (/student/i.test(message)) {
					result.didAskForName = true;
					return 'fred';
				}

				// check that they asked for a score
				const isScore = /score/i.test(message);
				if (isScore) {
					const score = scoreValues[result.scoreRequests];
					result.scoreRequests++;
					return score;
				}

			},

			// handle alerts
			onConsoleAlert: function(message) { },

			// check for printing results
			onConsoleLog: function(message) {

				// score must match
				if (result.scoreAverage === message || (0|message) === (0|result.scoreAverage))
					result.didPrintScore = true;

				if (/^(a\+?|b|c|d|f)$/i.test(message))
					result.didPrintGrade === true;

				if (message === result.studentName)
					result.didPrintStudentName = true;

			}

		}

	});


}

