import _ from 'lodash';
import STANDARD_REPLACEMENTS from './replacements';

// fixes phrases to make them read easier
export function fixSpeech(state, phrase) {
  if (_.isNumber(phrase))
    return phrase;

  // convert characters as needed
  const words = phrase.split(/ +/g);
  for (let i = 0; i < words.length; i++) {
    const word = (words[i]).toLowerCase();

    // check for replacements
    let replace = undefined; // state.replacements[word];
    if (!replace) replace = STANDARD_REPLACEMENTS[word];

    // save the change
    if (_.isString(replace)) 
      words[i] = replace;
  }

  return words.join(' ');
}