
import Schedule from '../schedule';

export default function getProjectAccess(id, userId) {
	return new Promise(async (resolve, reject) => {
		resolve(Schedule.current.sessions);
	});
}
