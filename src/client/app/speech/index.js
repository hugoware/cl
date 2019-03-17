import { _ } from 'lodash';
import { listen } from '../events';

// import * as speech from './azure';
import * as speech from './local';

// stop text when the window closes
listen('window-unload', () => {
	speech.stop();
});

export default speech;