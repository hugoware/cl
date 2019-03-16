import lib__lodash from 'lodash';
import lib__jquery from 'jquery';
import lib__bluebird from 'bluebird';
import lib__showdown from 'showdown';
import lib__cheerio from 'cheerio';
import lib__xmlchecker from 'xmlchecker';
import { Howl as lib__howler } from 'howler';
import lib__measure_text from 'measure-text';
import lib__random_color from 'randomcolor';
import lib__url from 'url';
import lib__mousetrap from 'mousetrap';
import lib__socket_io from 'socket.io-client';
import lib__dexie from 'dexie';
import lib__brace from 'brace';

// exports
export const _ = lib__lodash;
export const JQuery = lib__jquery;
export const $ = lib__jquery;
export const $jquery = lib__jquery;
export const Promise = lib__bluebird;
export const Bluebird = lib__bluebird;
export const Showdown = lib__showdown;
export const Cheerio = lib__cheerio;
export const XmlChecker = lib__xmlchecker;
export const Howl = lib__howler;
export const measureText = lib__measure_text;
export const RandomColor = lib__random_color;
export const url = lib__url;
export const Mousetrap = lib__mousetrap;
export const SocketIO = lib__socket_io;
export const Dexie = lib__dexie;
export const Brace = lib__brace;

// brace editor support
import 'brace/ext/language_tools';
import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/mode/xml';
import 'brace/mode/css';
import 'brace/theme/monokai';

// setup stuff
Brace.Range = Brace.acequire('ace/range').Range;
Brace.LanguageTools = Brace.acequire('ace/ext/language_tools');

// export defaults
export default {
	_,
	JQuery, $: JQuery,
	Promise, Bluebird: lib__bluebird,
	Showdown,
	Cheerio,
	XmlChecker,
	Howl,
	measureText,
	RandomColor,
	url,
	Mousetrap,
	SocketIO,
	Dexie,
	Brace
}
