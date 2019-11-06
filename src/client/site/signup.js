import { $e, $cs } from './utils';
// import Dropdown from './dropdown';

const INVALIDATE_CHECKOUT_TIMEOUT = 900000 * 2;
const BILLING_TARGET = window.CHARGEBEE_BILLING_TARGET;

let $signup;
let $classId;
let $startAt;
let $product;
let $cart;
let $time;
let $name;
let $hasSelection;
let $day;

let $enroll;
let $container;
let $date;
let $index;
let $tuesday;
let $thursday;
let $sunday;
let $saturday;
let $closeCheckout;



// // handle displaying the enroll screen
// function tryEnroll() {
// 	if (!$classId) return;
// 	showCheckout();
// }

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
		cf_class_id: $classId,
		cf_class_name: $name,
		cf_session_time: $time,
		cf_day_of_week: $day,
	};

	// add future date, if needed
	if (!isNaN($startAt))
		data.start_date = $startAt;

	// update the checkout
	$product.setCustomData(data);
	$signup.openCheckout(BILLING_TARGET);
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
	const start = new Date();
	start.setMonth(7);
	start.setDate(21);
	start.setFullYear(2019);

	// check timestamps
	const startAt = getTimestamp(start);
	const now = getTimestamp(new Date());
	const isFuture = startAt > now;
	if (!isFuture) return;

	$startAt = startAt;
}

// // handles a new day selection
// function onSelectDay(value, option) {
// 	let cx = document.body.className;
// 	cx = cx.replace(/select\-[a-z]+/g, '');
// 	cx += `select-time select-${value}`;
// 	document.getElementById('enrollment').className = cx;

// 	// no index
// 	$index = undefined;
// 	$day = option.text;

// 	// reset time blocks
// 	$tuesday.reset();
// 	$thursday.reset();
// 	$saturday.reset();
// 	$sunday.reset();
// }

// // handles a new time selection
// function onSelectTime(value, dropdown) {
// 	$time = dropdown.text;
// 	$index = dropdown.selection;
// }

// // hide all dropdowns
// function closeAll() {
// 	$tuesday.close();
// 	$thursday.close();
// 	$saturday.close();
// 	$sunday.close();
// 	$date.close();
// }

export default function initSignup() {
	setupCheckout();
	checkForFutureBilling();

	const container = $e('available-times');
	const registerButton = $e('enroll-now');

	// gather all
	const slots = [ 
		$e('web_tues_1700'),
		$e('web_tues_1800'),
		$e('web_tues_1900'),
		$e('code_thur_1700'),
		$e('code_thur_1800'),
		$e('code_thur_1900'),
	];

	// setup each handler
	for (const item of slots)
		(slot => {

			// make sure this can be selected
			if (!/is\-available/.test(slot.className))
				return;

			// check for selection
			slot.addEventListener('click', () => {
				const isSelected = /selected/.test(slot.className);
				const id = slot.getAttribute('id');
				const time = slot.getAttribute('data-time');
				const name = slot.getAttribute('data-name');
				const dayOfWeek = slot.getAttribute('data-day');

				// clear the active class
				$hasSelection = false;
				$classId = undefined;
				$time = undefined;
				$name = undefined;
				$day = undefined;

				// remove existing
				for (const other of slots)
					$cs(other, { 'is-selected': false });

				// remove selection
				if (!isSelected) {
					$hasSelection = true;
					$classId = id;
					$time = time;
					$name = name;
					$day = dayOfWeek;
					$cs(slot, { 'is-selected': !isSelected });
				}

				// finalize a couple things
				$cs(registerButton, { 'is-enabled': $hasSelection });
			});
		})(item);

	// allow registration
	registerButton.addEventListener('click', () => {
		if (!$hasSelection) return;
		showCheckout();
	});

	
	// handle selecting the class
	// const slots = $('.timeslot');
	// const container = $('.time-slots');

	// // handle selection
	// slots.on('click', event => {
	// 	const target = $(event.target);
	// 	const id = target.attr('data-id');

	// 	// get the class ID
	// 	$classId = undefined;

	// 	// clear selection
	// 	slots.removeClass('selected');

	// 	// selecting a new one
	// 	if (target.is('.selected')) {
	// 		container.removeClass('has-selection');
	// 	}
	// 	// selecting a new one
	// 	else {
	// 		$classId = id;
	// 		target.addClass('selected');
	// 		container.addClass('has-selection');
	// 	}
	// });


	// $container = $e('enrollment');
	// if (!$container) return;

	// setupCheckout();
	// checkForFutureBilling();

	// // date selection
	// $date = new Dropdown({
	// 	target: 'selected-day',
	// 	onSelect: onSelectDay,
	// 	onOpen: closeAll
	// });

	// // times
	// $tuesday = new Dropdown({
	// 	target: 'selected-tuesday',
	// 	onSelect: onSelectTime,
	// 	onOpen: closeAll
	// });

	// $thursday = new Dropdown({
	// 	target: 'selected-thursday',
	// 	onSelect: onSelectTime,
	// 	onOpen: closeAll
	// });

	// $saturday = new Dropdown({
	// 	target: 'selected-saturday',
	// 	onSelect: onSelectTime,
	// 	onOpen: closeAll
	// });
	
	// $sunday = new Dropdown({
	// 	target: 'selected-sunday',
	// 	onSelect: onSelectTime,
	// 	onOpen: closeAll
	// });

	// // activate enroll
	// $enroll = document.getElementById('enroll-now');
	// $enroll.addEventListener('click', tryEnroll);

	// // hide dropdowns
	// document.body.addEventListener('click', () => {
	// 	$date.close();
	// 	$tuesday.close();
	// 	$thursday.close();
	// 	$saturday.close();
	// 	$sunday.close();
	// });

}