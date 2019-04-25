
import { _, createTestRunner } from './lib';
import createTasks from './controllers/task-list';
// import * as tasks from './tasks';

export const controller = true;


const flags = { };

const runner = createTestRunner();
runner.reset();

runner.configure({

	onConsoleAsk: message => {


		if (/student/i.test(message)) {
			return 'fred';
		}

		
		const isScore = /score/i.test(message);

		if (isScore && !flags.asking_for_student_score_1) {
			flags.asking_for_student_score_1 = true;
			return 100;
		}

		else if (isScore && !flags.asking_for_student_score_2) {
			flags.asking_for_student_score_2 = true;
			return 80;
		}

		else if (isScore && !flags.asking_for_student_score_3) {
			flags.asking_for_student_score_3 = true;
			return 60;
		}

		else if (isScore && !flags.asking_for_student_score_4) {
			flags.asking_for_student_score_4 = true;
			return 40;
		}

		else if (isScore && !flags.asking_for_student_score_5) {
			flags.asking_for_student_score_5 = true;
			return 20;
		}

	},

	onConsoleAlert: message => {
		console.log('did alert');
	},

	onConsoleLog: message => {
		console.log('did log')
	}


})

const code = `
	var name = console.ask('what is student name?');
	var score1 = console.ask('what is score 1?');
	var score2 = console.ask('what is score 2?');
	var score3 = console.ask('what is score 3?');
	var total = score1 + score2 + score3;
	var avg = total / 3;
	console.log(total);
	console.log(avg);
`;
runner.run(code);

console.log(runner);


// // when activating a new 
// export default createTasks(module.exports, {
// 	title: 'Create a product website for "Juice Fruit" smoothie shop!',

// 	goal: `Create a program that asks for a student name and 5 grades. After doing that, get the average of the grades and then use if/then conditions to print A > 90 B > 80`
// }, {

// 	// tests the code
// 	onContentChanged(code) {




// 	}


// }

// // setup the main task
// task => {





	
// });
