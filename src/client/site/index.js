import Login from './login';
import Typed from './typed';

// is theis the login string
const isAppLogin = /__login__/.test(window.location.href);

// prepare the typed header
function initTyped() {

  const label = document.getElementById('feature-display');
  label.innerHTML = '&nbsp;';
  new Typed('#feature-display', {
    strings: [
      'Create Websites',
      'Build Games',
      'Make Mobile Apps',
      'Write Real Code',
    ],
    loop: true,
    typeSpeed: 100,
    backSpeed: 60,
    backDelay: 1500,
    startDelay: 0,
    autoInsertCss: true
  });
}


// prepare the map view
function initMap() {
  const target = document.getElementById('map');
  new google.maps.Map(target, {
    disableDefaultUI: true,
    center: { lat: 32.9746463,lng: -96.9895557 },
    // gestureHandling: 'greedy',
    scrollwheel: false,
    zoom: 15
  });
}

// prepares the login view
let $pendingError;
function initLogin() {
	let isLoggingIn;
	const container = document.getElementById('error');
	const reason = document.getElementById('reason');
	const btn = document.getElementById('login-button');

	// create the login
	const mode = isAppLogin ? 'redirect' : 'popup';
	const login = new Login(mode);

	// hide the loading class
	login.onReady = () => {
		if (isLoggingIn) return;
		document.body.className = '';
	};
	
	// successful login attempts
	login.onSuccess = () => {
		isLoggingIn = true;
		window.location.href = '/';
	};

	// failed login attempts
	login.onError = result => {
		reason.innerText = result.error;
		container.style.display = 'block';
		container.className = '';
		clearTimeout($pendingError);
		$pendingError = setTimeout(() => {
			container.className = 'fade-out';
			$pendingError = setTimeout(() => {
				container.style.display = 'none';
			}, 1000);
		}, 4000);
	};

  // handle login attempts
	btn.onclick = () => {
		if (/loading/i.test(document.body.className)) return;
		login.authenticate();
	};

	login.preauthenticate();

}

function initQuestions() {
  const questions = [];

  // hide all answer fields
  function hideAnswers() {
    for (const question of questions)
      question.className = 'question collapsed';
  }

  // setup each screen question
  let index = 1;
  while (true) {

    // no more questions
    const target = document.getElementById(`question-${index++}`);
    if (!target) break;

    // add this as a question
    questions.push(target);

    // setup the handler
    target.addEventListener('click', function() {
      hideAnswers();
      target.className = 'question';
    });
  }

  // hide by default
  hideAnswers();
}

// load each separately (just in case of errors)
window.addEventListener('load', initLogin);
if (!isAppLogin) window.addEventListener('load', initQuestions);
if (!isAppLogin) window.addEventListener('load', initTyped);
// window.addEventListener('load', initMap);