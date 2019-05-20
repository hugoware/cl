import { AllHtmlEntities } from 'html-entities';
import _ from 'lodash';
import $database from '../storage/database';
import $config from '../config';
import * as $clicksend from 'clicksend';

const $entities = new AllHtmlEntities();

const SMS_MESSAGE = `%%NAME%% wanted to tell you about a %%PROJECT_TYPE%% that they have been working on!

"%%MESSAGE%%" ~ from: %%NAME%%

You can click on the link below to check it out!

%%PROJECT_URL%%

Thanks!
CodeLab`;

const EMAIL_MESSAGE = `<div style="font-size: 15px; color: #000;" >
	<div style="font-size: 18px;">Hey There!</div>
	<p><strong>%%NAME%%</strong> wanted to tell you about a <strong>%%PROJECT_TYPE%%</strong> they have been working on!</p>
	<div style="background: #0C90F5; color: #fff; padding: 15px;" >
		<div style="padding: 0 0 10px 0" >%%MESSAGE%%</div>
		<div style="font-style: italic" ><strong>From: %%NAME%%</strong></div>
	</div>
	
	<p>You can see what they've created by clicking the button below!</p>

	<div style="padding:10px; background: #eee" >
		<div style="font-weight: bold">%%PROJECT_NAME%%</div>
		<div style="padding: 0 0 15px 0;" >%%PROJECT_DESCRIPTION%%</div>
		<a href="%%PROJECT_URL%%" style="display: inline-block; padding: 10px 20px; color: #fff; background: #0C90F5; text-decoration: none;" >
			Check it out!
		</a>
	</div>

	<div style="padding: 10px 0 10px 0; font-size: 16px" >Thanks!</div>
	<div style="font-weight: bold; font-size: 24px;" >CodeLab</div>
</div>`;

/** handles updating the progress for a lesson
 * @param {string} id the project ID to find
 * @param {string[]} names the names to send to
 */
export default async function shareProject(userId, projectId, message, names) {
	const users = await $database.users.find({ id: userId })
		.project({ first: 1, contacts: 1 })
		.toArray();

	const projects = await $database.projects.find({ id: projectId })
		.project({ name: 1, type: 1, description: 1, id: 1 })
		.toArray();

	// make sure something was found
	if (!(_.some(users) && _.some(projects)))
		throw 'invalid_request';

	// since it's okay, start sending messages
	const user = users[0];
	const project = projects[0];
	const url = `https://${project.id}.codelabschool.com/`;
	const type = project.type === 'game' ? 'video game'
		: project.type === 'mobile' ? 'mobile app'
		: project.type === 'web' ? 'website'
		: project.type === 'code' ? 'computer program'
		: 'secret project';

	// send each
	_.each(user.contacts, (value, name) => {
		if (!~names.indexOf(name)) return;

		// send as required
		if (~value.indexOf('@'))
			sendAsEmail(user, project, type, message, url, { name, email: value });
		else
			sendAsText(user, project, type, message, url, { name, mobile: value });
	});

}

// sends a message
function sendAsEmail(user, project, type, message, url, target) {
	const api = new $clicksend.TransactionalEmailApi($config.clicksendUsername, $config.clicksendApiKey);

	// sending to
	const recipient = new $clicksend.EmailRecipient();
	recipient.email = target.email;
	recipient.name = target.name;

	// sending from
	const from = new $clicksend.EmailFrom();
	from.emailAddressId = 5529;
	from.name = 'Hugo';

	const email = new $clicksend.Email();
	email.to = [ recipient ];
	email.from = from;
	email.html = true;
	email.subject = `Check Out %%NAME%%'s Project!`;
	email.body = EMAIL_MESSAGE;
	
	// replacements
	email.subject = email.subject.replace('%%NAME%%', $entities.encode(user.first));
	email.body = EMAIL_MESSAGE
		.replace('%%NAME%%', $entities.encode(user.first))
		.replace('%%NAME%%', $entities.encode(user.first))
		.replace('%%PROJECT_NAME%%', $entities.encode(project.name))
		.replace('%%PROJECT_URL%%', url)
		.replace('%%PROJECT_DESCRIPTION%%', $entities.encode(project.description))
		.replace('%%PROJECT_TYPE%%', $entities.encode(type))
		.replace('%%MESSAGE%%', $entities.encode(message));

	api.emailSendPost(email)
		.then(_.noop)
		.catch(ex => logError('email', ex));

}

function sendAsText(user, project, type, message, url, target) {

	const api = new $clicksend.SMSApi($config.clicksendUsername, $config.clicksendApiKey);

	const text = new $clicksend.SmsMessage();
	text.source = "sdk";
	text.to = target.mobile;
	text.body = SMS_MESSAGE
		.replace('%%NAME%%', user.first)
		.replace('%%NAME%%', user.first)
		.replace('%%PROJECT_NAME%%', project.name)
		.replace('%%PROJECT_URL%%', url)
		.replace('%%PROJECT_DESCRIPTION%%', project.description)
		.replace('%%PROJECT_TYPE%%', type)
		.replace('%%MESSAGE%%', message);

	// prepare to send
	const smsCollection = new $clicksend.SmsMessageCollection();
	smsCollection.messages = [ text ];

	api.smsSendPost(smsCollection)
		.then(_.noop)
		.catch(ex => logError('sms', ex));

}

// display the failure
function logError(type, ex) {
	console.error('failed to send', type, ex);
}
