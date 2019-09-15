export const name = 'demo-lesson';
export const route = /^\/(code|web)?_?demo/;

// determines the correct home view
export async function handle(request, response) {
	response.render('app/index', {});
}