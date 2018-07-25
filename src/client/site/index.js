import Login from './login';
import Typed from './typed';

// prepare the typed header
function initTyped() {

  const label = document.getElementById('feature-display');
  label.innerHTML = '';
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
function initLogin() {
  const login = new Login();

  // handle login attempts
  const btn = document.getElementById('login-button');
  btn.onclick = () => {
    login.authenticate({
      onSuccess: () => {
        console.log('try login');
        window.location.href = '/';
      },
      onError: result => {
        console.log('failed', result);
      }
    });
  };

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
window.addEventListener('load', initQuestions);
window.addEventListener('load', initTyped);
window.addEventListener('load', initMap);