
import $axios from 'axios';
import $firebase from 'firebase/app';
import 'firebase/auth';

const DEFAULT_ERROR = 'There was an error attempting to log in. Please check your connection and try again.';

export default class Login {

  // setup
  constructor(mode) {
    $firebase.initializeApp({
      apiKey: "AIzaSyC2IT9cISeQwsY6hJDrPR8IMyIUqOcxcCE",
      authDomain: "codelabschool.firebaseapp.com",
      databaseURL: "https://codelabschool.firebaseio.com",
      projectId: "codelabschool",
      storageBucket: "",
      messagingSenderId: "76418316546"
    });

    // prepare the auth provider
    const provider = new $firebase.auth.GoogleAuthProvider();
		provider.addScope('email');

		// save some properties
		this.mode = mode[0].toUpperCase() + mode.substr(1);
    this.provider = provider;
		this.auth = $firebase.auth();
	}
	
	// preauthentication step
	async preauthenticate() {
		const { auth } = this;
		const result = await auth.getRedirectResult();
		attemptLogin(this, result);
	}

  // attempts to login
  async authenticate() {
		const { auth, provider } = this;

		// perform the login attempt
		const result = await auth[`signInWith${this.mode}`](provider);
		attemptLogin(this, result);
	}
	
}

// authenticate the token for the login attempt
async function attemptLogin(instance, attempt) {

	// check for a credential
	if (!attempt || !attempt.credential)
		return instance.onReady();

	// sign in with the pop up
	try {
		// set the token to the app to verify
		// that the login was really successful
		const token = attempt.credential.idToken;
		const result = await $axios.post('/login', { token });
		const data = result.data || { success: false, error: DEFAULT_ERROR }

		// failed to login
		if (!data.success) instance.onError(data);
		else instance.onSuccess();
	}
	// handle any errors
	catch (err) {
		instance.onError({ error: DEFAULT_ERROR })
	}
}
