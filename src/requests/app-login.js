
export const name = 'app login';
export const route = '/__login__';

// shows the application splash login
export function handle(request, response) {
	response.render('site/login');
}