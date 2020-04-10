import _ from 'lodash';

const $activity = {};

/** registers an active project */
export function register(
  userId,
  userName,
  projectId,
  projectName,
  projectType
) {
  // don't crash because of this
  try {
    const record = ($activity[userId] = $activity[userId] || {
      id: userId,
      name: userName,
      projects: [],
    });

    // remove it, if already there
    _.remove(record.projects, (project) => project.id === projectId);

    // move to the top so the most recent is first
    record.projects.unshift({
      id: projectId,
      name: projectName,
      type: projectType,
    });
  } catch (ex) {
    console.error(ex);
  }
}

/** gives back all projects */
export function getList() {
  return $activity;
}
