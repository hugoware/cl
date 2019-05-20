import { $e } from './utils';
import Dropdown from './dropdown';

const INVALIDATE_CHECKOUT_TIMEOUT = 900000 * 2;

let $signup;
let $enroll;
let $container;
let $product;
let $cart;
let $date;
let $time;
let $day;
let $index;
let $tuesday;
let $thursday;
let $sunday;
let $saturday;
let $startAt;
let $closeCheckout;



// handle displaying the enroll screen
function tryEnroll() {
	if (!$index) return;
	showCheckout();
}

// create a timestamp of a date
function getTimestamp(asOf) {
	asOf.setMinutes(0, 0, 0);
	const timestamp = Date.UTC(
		asOf.getFullYear(), 
		asOf.getMonth(), 
		asOf.getDate(), 
		asOf.getHours(),
		asOf.getMinutes(),
		asOf.getSeconds(),
		asOf.getMilliseconds());
	return Math.floor(timestamp / 1000);
}

// displays the checkout
function showCheckout() {

	// set a timer
	$closeCheckout = setTimeout(() => window.location.reload(), INVALIDATE_CHECKOUT_TIMEOUT);

	// create the data
	const data = {
		cf_session_id: $index,
		cf_session_time: `${$day} @ ${$time}`,
	};

	// add future date, if needed
	if (!isNaN($startAt))
		data.start_date = $startAt;

	// update the checkout
	$product.setCustomData(data);
	$signup.openCheckout('codelab-test');
}

// prepare for the checkout process
function setupCheckout() {
	$signup = Chargebee.getInstance();

	// set single subscription
	$cart = $signup.getCart();
	$product = $signup.initializeProduct('codelab-tutoring', 1);
	$cart.addItem($product);

	// // handle events
	// $signup.setCheckoutCallbacks(function (cart) {

	// 	return {
	// 		loaded: () => {
	// 			console.log("checkout opened");
	// 		},
	// 		close: () => {
	// 			console.log("checkout closed");
	// 		},
	// 		success: hostedPageId => {

	// 		},
	// 		step: value => {
	// 			// value -> which step in checkout
	// 			console.log(value);
	// 		}
	// 	}
	// });

}

// updates UI for future billing
function checkForFutureBilling() {
	
	// create the start date -- for now July 1
	const start = new Date();
	start.setMonth(6);
	start.setDate(15);
	start.setFullYear(2019);

	// check timestamps
	const startAt = getTimestamp(start);
	const now = getTimestamp(new Date());
	const isFuture = startAt > now;
	if (!isFuture) return;

	$startAt = startAt;
}

// handles a new day selection
function onSelectDay(value, option) {
	let cx = document.body.className;
	cx = cx.replace(/select\-[a-z]+/g, '');
	cx += `select-time select-${value}`;
	document.getElementById('enrollment').className = cx;

	// no index
	$index = undefined;
	$day = option.text;

	// reset time blocks
	$tuesday.reset();
	$thursday.reset();
	$saturday.reset();
	$sunday.reset();
}

// handles a new time selection
function onSelectTime(value, dropdown) {
	$time = dropdown.text;
	$index = dropdown.selection;
}

// hide all dropdowns
function closeAll() {
	$tuesday.close();
	$thursday.close();
	$saturday.close();
	$sunday.close();
	$date.close();
}

export default function initSignup() {
	$container = $e('enrollment');
	if (!$container) return;

	setupCheckout();
	checkForFutureBilling();

	// date selection
	$date = new Dropdown({
		target: 'selected-day',
		onSelect: onSelectDay,
		onOpen: closeAll
	});

	// times
	$tuesday = new Dropdown({
		target: 'selected-tuesday',
		onSelect: onSelectTime,
		onOpen: closeAll
	});

	$thursday = new Dropdown({
		target: 'selected-thursday',
		onSelect: onSelectTime,
		onOpen: closeAll
	});

	$saturday = new Dropdown({
		target: 'selected-saturday',
		onSelect: onSelectTime,
		onOpen: closeAll
	});
	
	$sunday = new Dropdown({
		target: 'selected-sunday',
		onSelect: onSelectTime,
		onOpen: closeAll
	});

	// activate enroll
	$enroll = document.getElementById('enroll-now');
	$enroll.addEventListener('click', tryEnroll);

	// hide dropdowns
	document.body.addEventListener('click', () => {
		$date.close();
		$tuesday.close();
		$thursday.close();
		$saturday.close();
		$sunday.close();
	});

}