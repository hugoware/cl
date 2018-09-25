import _ from 'lodash';

import showdown from 'showdown';
const converter = new showdown.Converter();
import $cheerio from 'cheerio';
import { fixSpeech } from './speech';

// creates a new question
export default function processQuestion(state, manifest, question) {
	question.type = 'question';


  question.title = inlineConvert(question.title);
  question.speak = [ toSpeech(state, question.title) ];

  // check for follow up
  if ('explain' in question) {
    question.explain = inlineConvert(question.explain);
    question.explained = toSpeech(state, question.explain);
  }

  // format questions, if needed
  question.choices = _.map(question.choices, inlineConvert);
  
}

// quick conversion removing paragraphs
function inlineConvert(str) {
  str = converter.makeHtml(str);
  return str.replace(/^<p>|<\/p>$/g, '');
}

function toSpeech(state, str) {
  str = $cheerio.load(str).text();
  str = fixSpeech(state, str);
  return str;
}