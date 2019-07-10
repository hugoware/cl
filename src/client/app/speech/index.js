import { _ } from 'lodash';
import { listen } from '../events';

// load the correct library
import * as streamed from './streamed';
import * as local from './local';
const useStream = false;
const isLocal = /https?:\/{2}localhost/.test(window.location.href);
const speech = useStream || !isLocal ? streamed : local;

// stop text when the window closes
listen('window-unload', () => {
	speech.stop();
});

export default speech;