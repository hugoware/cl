
import _ from 'lodash';
import $database from '../storage/database';

// performs a user login
export default async function setAvatar(userId, avatarId) {

	// parse the avatar
	let avatar = '';;
	avatarId.replace(/(girl|boy)/, match => {
		avatar += match;
		return '';
	});

	// then check for the number
	avatarId.replace(/\d+/, match => {
		avatar += `-${match}`;
	});

	// replace the ID
	await $database.users.update({ id: userId }, {
		$set: { avatar }
	});

	// give back the user ID
	return { avatar };
}