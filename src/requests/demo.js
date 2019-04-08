export const name = 'demo';
export const route = '/demo';

// determines the correct home view
export async function handle(request, response) {
	response.render('app/index', {});
}