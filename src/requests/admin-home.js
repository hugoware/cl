
export const name = 'admin';
export const route = '/admin';
export const permissions = 'admin';

// determines the correct home view
export function handle(request, response) {
	response.render('admin/index');
}