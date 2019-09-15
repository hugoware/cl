
import $chargebee from 'chargebee';
import $database from '../storage/database';
import $moment from 'moment';
import audit from '../audit'

const PAYMENT_RESERVATION_EXTENSION = 40;

// check the status of each account
export default function syncPaymentStatus() {
	return new Promise((resolve, reject) => {
		$chargebee.transaction.list()
			.request(async (error, result) => {
				const renewed = [ ];

				// maintenance failed
				if (error)
					return reject(error);

				// check each transaction
				for (const item of result.list) {
					const { transaction } = item;

					// update any associated subscription to be
					// 40 days out from the last payment
					const subscriptionId = transaction.subscription_id;
					const date = $moment(transaction.date * 1000);
					date.add(PAYMENT_RESERVATION_EXTENSION, 'days');
					const activeUntil = date.valueOf();

					// update any subscriptions
					renewed.push(subscriptionId);
					await $database.users.update({ subscriptionId }, {
						$set: { activeUntil }
					});
				}

				audit.log('sync-payment-status', { renewed, total: renewed.length });
				resolve();
			});
	});
}
