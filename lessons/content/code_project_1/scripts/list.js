
import { _ } from './lib';
import createTasks from './controllers/task-list';
import validationTest from './validationTests';

// when activating a new 
export default createTasks(module.exports, {
	title: 'Create a product website for "Juice Fruit" smoothie shop!',

	goal: `
# HEading 1
## HEading 2
### HEading 3

Create a program that asks for a student name and 5 grades. After doing that, get the average of the grades and then use if/then conditions to print A > 90 B > 80

### Grading Table

| Score                       | Grade |
|=============================|=======|
| \`score\` equal to 90       | A+    |
| \`score\` greater than 90   | A     |
| \`score\` greater than 80   | B     |
| \`score\` greater than 70   | C     |
| \`score\` less than 70      | F     |

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

				console.log(result);
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

	for (let i = 0; i < 30; i++) {

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

	task("Use `calculateGrade` function with the student's average", {

		onValidateTasks() {
			this.isValid = this.project.state.didCallCalculateGrade;
		}

	});

	}





	
});
