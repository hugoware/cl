
import _ from 'lodash';
import $ from 'jquery';
import manageUser from './manage-user';
import createUser from './create-user';
import manageContacts from './manage-contacts';

// common items
$.fn.field = function(key) {
	const val = $(this).find(`[field-${key}]`).val();
	return _.trim(val);
};

// show a dialog window
$.dialog = id => {
	$.dialog.hide();
	$(`#${id}`).show();
};

$.dialog.hide = () => {
	$('.dialog').hide();
};

// handles sending asyng requests
$.request = async (url, data) => {
	return $.ajax({ url, data, method: 'POST' });
};

// simple error handler
$.error = (source, err) => {
	$('#error .source').text(source);
	$('#error .message').text(JSON.stringify(err, null, 2));
	$('#error').show();
};

// simple success handler
$.success = message => {
	$('#success .message').text(message);
	$('#success').show();
};

$(() => {
	const root = $(document.body);
	const modules = $('.module');
	const error = $('#error');
	const success = $('#success');

	// allow clicking the error message
	$(error).on('mouseup', event => {
		event.stopPropagation();
		return false; 
	});

	// hides popups
	$(window).on('mouseup', () => {
		error.hide();
		success.hide();
	});

	// toggle different modules
	root.on('click', '.module .title', event => {
		const mod = $(event.currentTarget).closest('.module');
		modules.removeClass('active');
		mod.addClass('active');
	});

	// toggle different modules
	root.on('click', '.dialog .close', $.dialog.hide);
	
	// initialize
	manageUser();
	createUser();
	manageContacts();
});