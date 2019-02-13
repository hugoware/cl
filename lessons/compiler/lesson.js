import _ from 'lodash';
import processSlide from './slide';
import processQuestion from './question';

// handles formatting the speech
import STANDARD_REPLACEMENTS from './replacements';

// extracts and creates all dictionary slides
export default function processSlides(state, manifest, slides) {
	manifest.lesson = [ ];
	
	// start creating each slide
	_.each(slides, ({ slide, question }) => {
		
		// create the slide item
		if (slide) {
      // processSlide(state, manifest, slide);
      manifest.lesson.push(slide);
    }

    // create the question item
    if (question) {
			// processSlide(state, manifest, question);
			// processQuestion(state, manifest, question);
			manifest.lesson.push(question);
		}
	});
}