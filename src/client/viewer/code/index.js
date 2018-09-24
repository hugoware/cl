
import $ from 'cash-dom';
import $icons from '../../app/icons';
import CodeRunner from '../code-runner';
CodeRunner.create(instance => {
	const doc = $(document.body);
	const code = window.__CODE__;

	// set the view
	doc.addClass('intro');

	// replace the icon
	const avatar = $('#avatar');
	const avatarId = avatar.attr('avatar');
	const icon = $icons.avatar(avatarId);
	avatar.append(icon);

	// handle executing the app
	$('.action.run').on('click', () => {
		doc.removeClass('intro is-finished');
		doc.addClass('program');
		
		// kick off the request
		instance.clear();
		instance.load('Preparing to run');
		setTimeout(() => instance.run(code), 1000);
	});

	// listen for runner to be done
	window.addEventListener('preview-message', () => {
		doc.addClass('is-finished');
	});
});
