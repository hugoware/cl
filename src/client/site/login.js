
import $axios from 'axios';
import $firebase from 'firebase/app';
import 'firebase/auth';

const DEFAULT_ERROR = 'There was an error attempting to log in. Please check your connection and try again.';

export default class Login {

  // setup
  constructor() {
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

    // save the config
    this.provider = provider;
  }

  // attempts to login
  async authenticate({ onSuccess, onError }) {
    const { provider } = this;
    const auth = $firebase.auth();
		const attempt = await auth.signInWithPopup(provider);

    // sign in with the pop up
    try {
      // set the token to the app to verify
      // that the login was really successful
      const token = attempt.credential.idToken;
			const result = await $axios.post('/login', { token });
			const data = result.data || { success: false, error: DEFAULT_ERROR }
      if (!data.success) onError(data);
      else onSuccess();
    }
    // handle any errors
    catch (err) {
      onError({ error: DEFAULT_ERROR })
    }
  }
}