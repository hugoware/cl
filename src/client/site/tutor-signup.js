import { $e, $cs } from './utils';

// find the correct store name
const BILLING_TARGET = window.CHARGEBEE_BILLING_TARGET;

const INVALIDATE_CHECKOUT_TIMEOUT = 900000 * 2;

let $signup;
let $product;
let $cart;
let $closeCheckout;

export default function showCheckout() {
	$signup = Chargebee.getInstance();

	// handle closing early
	$signup.setCheckoutCallbacks(() => ({
		close: function() {
			window.location.href = '/';
		}
	}));

	// set single subscription
	$cart = $signup.getCart();
	$product = $signup.initializeProduct('codelab-tutoring-private', 1);
	$cart.addItem($product);

	// set a timer
	$closeCheckout = setTimeout(() => {
		window.location.href = '/';
	}, INVALIDATE_CHECKOUT_TIMEOUT);

	// create the data
	const data = {
		cf_class_id: 'private_tutoring',
		cf_class_name: "Private Tutoring"
	};

	// update the checkout
	$product.setCustomData(data);
	$signup.openCheckout(BILLING_TARGET);
}
