
import _ from 'lodash';
import $database from '../storage/database';
import $chargebee from 'chargebee';
import $config from '../config';
import $log from '../log';
import * as $clicksend from 'clicksend';
import createAuthCode from './create-auth-code'

import { AllHtmlEntities } from 'html-entities';
const $entities = new AllHtmlEntities();

const CUSTOMER_LOGIN = 'https://codelab.chargebeeportal.com/portal/v2/login';

const EMAIL_MESSAGE = `<div>
	<h2>Hello %%NAME%%,</h2>
	<p>It appears that you have an invoice for CodeLab that hasn't been paid. Please take a moment and log into the customer portal to update billing information and pay the outstanding invoice.</p>
	<p><a href="%%CUSTOMER_URL%%" >Customer Portal</a></p>
	<h4>Thank you!</h4>
	<h2>CodeLab</h2>
</div>`

// attempts to login
export function kioskLogin(data) {
	return new Promise(async (resolve, reject) => {
		const keycode = _.trim(data.keycode);

		// find the user
		const users = await $database.users.find({ keycode })
			.project({ id: 1, type: 1, first: 1, subscriptionId: 1, keycode: 1 })
			.toArray();

		// not a barcode
		const [ user ] = users;
		if (!user)
			return resolve({ status: 'no_user' });

		if (user.type === 'admin')
			return authorize(user, resolve);

		// next, check the subscription status
		try  {
			const { subscriptionId } = user;
			$chargebee.subscription.retrieve(subscriptionId)
				.request(async (error, result) => {

					// failed for another reason
					if (error) {

						// all other errors
						if (error.http_status_code === 404) {
							return resolve({ status: 'missing' });
						}
						// log all other errors
						else {
							const data = Object.assign({ subscriptionId, error });
							audit.log('kiosk', user.id, data);
							return resolve({ status: 'server_error' });
						}
					}

					// not an active account
					if (!/^(active|non_renewing)$/i.test(result.subscription.status)
						|| result.subscription.due_invoices_count > 0) {
						notifyExpiredAccount(result);

						// setup account to expire soon
						// TODO: expire accounts
					}

					// generate the code for use
					authorize(user, resolve);
				});

		}
		// had and error
		catch (err) {
			console.log(err);
			reject('subscription_error');
		}

	});
}

// performs the auth
async function authorize(user, resolve) {
	// generate the code for use
	const authCode = await createAuthCode({ id: user.id });
	resolve({ success: true, first: user.first, authCode, userId: user.id });
}

function notifyExpiredAccount(account) {
	const api = new $clicksend.TransactionalEmailApi($config.clicksendUsername, $config.clicksendApiKey);

	// sending to
	const recipient = new $clicksend.EmailRecipient();
	recipient.email = account.customer.email;
	recipient.name = account.customer.first_name;

	// sending from
	const from = new $clicksend.EmailFrom();
	from.emailAddressId = 5529;
	from.name = 'Hugo';

	const email = new $clicksend.Email();
	email.to = [recipient];
	email.from = from;
	email.html = true;
	email.subject = `CodeLab Invoice Reminder`;
	email.body = EMAIL_MESSAGE;

	// replacements
	// email.subject = email.subject.replace('%%NAME%%', $entities.encode(user.first));
	email.body = EMAIL_MESSAGE
		.replace('%%NAME%%', $entities.encode(account.customer.first_name))
		.replace('%%CUSTOMER_URL%%', CUSTOMER_LOGIN)
		// .replace('%%PROJECT_NAME%%', $entities.encode(project.name))
		// .replace('%%PROJECT_DESCRIPTION%%', $entities.encode(project.description))
		// .replace('%%PROJECT_TYPE%%', $entities.encode(type))
		// .replace('%%MESSAGE%%', $entities.encode(message));

	api.emailSendPost(email)
		.then(_.noop)
		.catch(ex => $log.bind(`kiosk-login.js`, ex));
}