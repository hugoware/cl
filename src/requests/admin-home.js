import { getList } from '../activity';
export const name = 'admin';
export const route = '/admin';
export const permissions = 'admin';

// determines the correct home view
export function handle(request, response) {
  const activity = getList();
  response.render('admin/index', { activity });
}
