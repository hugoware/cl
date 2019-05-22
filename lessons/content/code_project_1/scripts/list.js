
import { _ } from './lib';
import createTasks from './controllers/task-list';
import validationTest from './validationTests';

// when activating a new 
export default createTasks(module.exports, {
	title: 'Create a product website for "Juice Fruit" smoothie shop!',

	goal: `Create a function called \`showGrade\` that accepts a \`score\` argument and then prints a grade using the following table.
	
Next, use \`console.ask\` to get the **student's name** and **five individual scores**. Calculate the **student's average score** using each of the scores provided.

### Grading Table

| Score                       | Grade |
|=============================|=======|
| \`score\` equal to 100      | A+    |
| \`score\` greater than 90   | A     |
| \`score\` greater than 80   | B     |
| \`score\` greater than 70   | C     |
| \`score\` less than 70      | F     |

Finally, use \`console.log\` to print the **student's name**, the **average**, and then call \`showGrade\` to display the **student's grade**.

	`,

	events: {

		// perform 
		onContentChange(file) {
			delete this.ex;

			// only checking for main.js
			if (file.path !== '/main.js') return;

			// check the content
			validationTest(file, (err, result) => {
				this.state = result;

				if (!err && !result.hasException)
					this.validateTasks();

				// set the error
				else this.setError(err || result.ex || result.exception || result.error || result.err);
			});
		}

	}

},

// setup the main task
task => {

	task('Create a `showGrade` function', () => {

		task('Declare a function `showGrade`', {
			topic: 'Functions',
			onValidateTasks() {
				this.isValid = this.project.state.hasShowGradeFunction;
			}
		});

		task('Accept a single argument named `score`', {
			topic: 'Functions',
			onValidateTasks() {
				this.isValid = this.project.state.showGradeArgumentCount === 1;
			}
		});

		task('Use `console.log` to show results for `score`', () => {

			task('Log `A++` if `score` equal to `100', {
				topic: 'Logical Conditions',
				onValidateTasks() {
					this.isValid = this.project.state.didDisplayGradeAPlusPlus;
				}
			});

			task('Log `A` if `score` greater than or equal to `90', {
				topic: 'Logical Conditions',
				onValidateTasks() {
					this.isValid = this.project.state.didDisplayGradeA;
				}
			});

			task('Log `B` if `score` greater than or equal to `80', {
				topic: 'Logical Conditions',
				onValidateTasks() {
					this.isValid = this.project.state.didDisplayGradeB;
				}
			});

			task('Log `C` if `score` greater than or equal to `70', {
				topic: 'Logical Conditions',
				onValidateTasks() {
					this.isValid = this.project.state.didDisplayGradeC;
				}
			});

			task('Log `F` if `score` for all other values', {
				topic: 'Logical Conditions',
				onValidateTasks() {
					this.isValid = this.project.state.didDisplayGradeF;
				}
			});

		});


	});

	task('Collect Student Information', () => {

		task('Use `console.ask` to ask for the "student name"', {
			onValidateTasks() {
				this.isValid = this.project.state.didAskForName;
			}
		});

		task('Use `console.ask` to ask for "score 1"', {
			onValidateTasks() {
				this.isValid = this.project.state.didAskForScore1;
			}
		});

		task('Use `console.ask` to ask for "score 2"', {
			onValidateTasks() {
				this.isValid = this.project.state.didAskForScore2;
			}
		});

		task('Use `console.ask` to ask for "score 3"', {
			onValidateTasks() {
				this.isValid = this.project.state.didAskForScore3;
			}
		});

		task('Use `console.ask` to ask for "score 4"', {
			onValidateTasks() {
				this.isValid = this.project.state.didAskForScore4;
			}
		});

		task('Use `console.ask` to ask for "score 5"', {
			onValidateTasks() {
				this.isValid = this.project.state.didAskForScore5;
			}
		});

	});


	task('Print Student Information', () => {

		task("Use `console.log` to print the student\'s name", {
			onValidateTasks() {
				this.isValid = this.project.state.didPrintStudentName;
			}
		});

		task("Use `console.log` to print the student's average", {

			onValidateTasks() {
				this.isValid = this.project.state.didPrintAverage;
			}

		});

	});

	task("Use `showGrade` function with the student's average", {
		topic: 'Functions',
		onValidateTasks() {
			this.isValid = this.project.state.didPrintGrade;
		}

	});


	
});
