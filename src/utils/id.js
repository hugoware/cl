
import generate from 'nanoid/generate';
import BadLanguageFilter from 'bad-language-filter';

const $filter = new BadLanguageFilter();
const DEFAULT_ID_LENGTH = 9;
const UNIQUE_ID_CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyz';


// returns a valid UUID
export function uniqueId(length = DEFAULT_ID_LENGTH, safety = 0) {
  if (safety > 50) return null;
  const id = generate(UNIQUE_ID_CHARACTERS, length);
  return $filter.contains(id) ? uniqueId(length, ++safety) : id;
}