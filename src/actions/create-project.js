import _ from 'lodash';
import $database from '../storage/database';
import format from '../formatters';
import $fsx from 'fs-extra';
import $date from '../utils/date';
import $audit from '../audit';
import projectValidator from '../validators/project';
import { resolveProject, resolveResource } from '../path';
import database, {
  PROJECT_TYPE_TEMP,
  PROJECT_TYPE_PERMANENT,
} from '../storage/database/index';

/** expected params for a project
 * @typedef CreateProjectData
 * @prop {string} type the kind of project to create
 * @prop {string} ownerId the id for the owner of the project
 * @prop {string} name the name of the project
 * @prop {string} [description] the description about the project, if any
 * @prop {string} [language] the language to use for a project type, if any
 */

/** @typedef {Object} CreateProjectResult
 * @prop {boolean} success was the creation attempt successful
 * @prop {object} [errors] a mapping of errors, if any
 */

/** handles creating a project
 * @param {CreateProjectData} data project data
 * @returns {CreateProjectResult}
 */
export default async function createProject(data, options = {}) {
  return new Promise(async (resolve, reject) => {
    // format the data first
    const ownerId = format.trim(data.ownerId);
    const name = format.toName(data.name);
    const description = format.removeExtraSpaces(data.description);
    const type = format.toAlias(data.type);
    const language = format.toAlias(data.language);
    const blank = !!data.blank;

    // perform basic validation
    // todo: get rid of this someday
    const errors = {};
    let error = projectValidator.validateName(name, errors);
    error = error || projectValidator.validateDescription(description, errors);
    error = error || projectValidator.validateType(type, errors);
    // error = error || projectValidator.validateLanguage(language, type, errors);

    // if there were any data errors, stop now
    if (!!error) return resolve({ success: false, error });

    // check for the user
    const userExists = await $database.exists($database.users, { id: ownerId });
    if (!userExists)
      return resolve({ success: false, error: 'user_not_found' });

    // make sure this name isn't already in use
    const projects = await $database.projects
      .find({ ownerId })
      .project({ name: 1, ownerId: 1, removed: 1 })
      .toArray();

    // check if any of the names are too similar
    let tooSimilar;
    const simpleName = simplifyName(name);
    _.each(projects, (project) => {
      if (!project.removed && simplifyName(project.name) === simpleName) {
        tooSimilar = true;
      }
    });
    if (tooSimilar)
      return resolve({ success: false, error: 'name_already_exists' });

    try {
      // get a new ID for this project
      const id = await $database.generateId($database.projects, 6);
      const now = $date.now();
      const project = {
        id,
        ownerId,
        name,
        description,
        type,
        modifiedAt: now,
        status:
          options.inClassroom || options.isFree
            ? PROJECT_TYPE_TEMP
            : PROJECT_TYPE_PERMANENT,
      };

      if (!!language) project.language = language;

      // try and save the record
      await $database.projects.insertOne(project);

      // make sure to create the new project directory
      await generateProject(id, type, blank);

      // ready to go
      $audit.log('create-project', ownerId, { id, name, description, type });
      return resolve({ success: true, id });
    } catch (err) {
      console.error(err);
      reject('database_error');
    }
  });
}

async function generateProject(id, type, isBlank) {
  return new Promise((resolve, reject) => {
    if (isBlank) {
      const dir = resolveProject(id);
      return $fsx.mkdir(dir, (err) => {
        if (err) reject(err);
        else resolve();
      });
    }

    const directory = resolveProject(id);
    const source = resolveResource(`projects/${type}`);
    $fsx.copy(source, directory, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// creates a simple name
function simplifyName(name) {
  return _.snakeCase(_.trim(name).toLowerCase());
}
