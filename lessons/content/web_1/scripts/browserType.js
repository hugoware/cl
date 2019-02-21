import { _ } from './lib';

export const controller = true;

export function onEnter() {

	// Opera 8.0+
	const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

	// Firefox 1.0+
	const isFirefox = typeof InstallTrigger !== 'undefined';

	// Safari 3.0+ "[object HTMLElementConstructor]" 
	const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

	// Internet Explorer 6-11
	const isIE = /*@cc_on!@*/false || !!document.documentMode;

	// Edge 20+
	const isEdge = !isIE && !!window.StyleMedia;

	// Chrome 1 - 71
	const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

	// Blink engine detection
	const isBlink = (isChrome || isOpera) && !!window.CSS;

	// get the name
	const name = isOpera ? 'Opera'
		: isFirefox ? 'Firefox'
		: isSafari ? 'Safari'
		: isIE ? 'Internet Explorer'
		: isEdge ? 'Edge'
		: isChrome ? 'Chrome'
		: isBlink ? 'Blink'
		: null;

	const tell = name ? `For example, the name of the web browser you're using is *${name}*!`
		: `However, in this case I'm not sure what browser you're using`;


	this.assistant.say({
		emote: 'happy',
		message: `
			When you browse the [define internet], you visit [define website websites] that show you information. That information is displayed on your screen using a [define web_browser web browser].

			There's many web browsers that are used such as Chrome, Firefox, Safari, and more.

			${tell}`
		});

}