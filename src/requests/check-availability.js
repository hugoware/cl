import Schedule from '../schedule'

export const name = 'check availability';
export const route = '/availability/:slot';

export function handle(request, response) {
	const { slot } = request.params;
	const open = Schedule.checkTimeSlot(0|slot);
	response.end(open);
}