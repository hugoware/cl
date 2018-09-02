import _ from 'lodash';

// extracts and creates all dictionary snippets
export default function processSnippets(state, manifest, snippets) {
	manifest.snippets = { };
	
	_.each(snippets, ({ snippet }) => {	
		manifest.snippets[snippet.id] = snippet;

		// cleanup
		snippet.content = _.trim(snippet.content);
		const { length } = snippet.content;

		// update each highlighted zone
		_.each(snippet.zones, (zone, id) => {
      const parts = _.compact(zone.split(/ +/));
      let lineStart = 0;
      let lineEnd = 0;
      let characterStart = 0;
      let characterEnd = 0;

      // check if this is for the whole line or not
      let isEntireLine = false;
      for (let i = parts.length; i-- > 0;) {
        if (parts[i] === 'line') {
          isEntireLine = true;
          parts.splice(i, 1);
        }
      }

      // get the numeric parts
      const start = parts[0].split(':');
      const end = parts[1].split(':');
      _.each(start, (value, index) => start[index] = parseInt(value));
      _.each(end, (value, index) => end[index] = parseInt(value));

      // parse the start of the zone
      if (isEntireLine) {
        characterStart = 1;
        lineStart = start[0];
      }
      else if (_.isNumber(start[1])) {
        characterStart = start[1];
        lineStart = start[0];
      }
      else {
        lineStart = 0;
        characterStart = start[0];
      }


      // parse the ending of the zone
      if (isEntireLine) {
        characterEnd = 1;
        lineEnd = end[0];
      }
      else if (_.isNumber(end[1])) {
        characterEnd = end[1];
        lineEnd = end[0];
      }
      else {
        lineEnd = 0;
        characterEnd = end[0];
      }

      // save the ranges
      snippet.zones[id] = { 
        start: { line: lineStart, index: characterStart },
        end: { line: lineEnd, index: characterEnd },
      };

      // check the entire line highlight
      if (isEntireLine)
        snippet.zones[id].line = true;


			// // verify the range
			// const invalid = start >= length ? 'start exceeds length'
			//  : end > length ? 'end exceeds length'
			//  : start < 0 ? 'start before start'
			//  : end < 0 ? 'end before start'
			//  : end === start ? 'range is zero'
			//  : end < start ? 'end is less than start'
			//  : null;

			// if (invalid)
			// 	throw `zone: ${id} ${invalid}`;
      console.log(snippet.zones);   

			// save the snippet// 
			// console.log(manifest.snippets);
		});
	});

}