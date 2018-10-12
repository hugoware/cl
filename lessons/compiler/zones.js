import _ from 'lodash';
import $path from 'path';
import $fs from 'fs';
import ZoneMap from '../../src/client/app/zone-map';

export default function processZones(manifest, zones, source) {

  // check each zone
  _.each(zones, (zone, path) => {
    if (path[0] === '/')
      processFileZone(zone, path, source);

    else
      processSnippetZone(zone, path, manifest);

  });

}


// fixes all zones
function processFileZone(zones, id, source) {

  // get this file path
  let path = id.replace(/\$/g, '.');
  path = $path.resolve(source, `.${path}`);
  let content = $fs.readFileSync(path).toString();


  // create a zone map
  const map = ZoneMap.create(content, zones);

  // util to get a zone length
  function getLength(id) {
    const zone = map.zones[id];
    return zone.end.index - zone.start.index;
  }

  // gather each zone
  const arranged = [ ];
  for (const id in map.zones) {
    arranged.push({ id, length: getLength(id) });
  }

  // collapse in order
  _(arranged)
    .sortBy('length')
    .each(item => {
      const zone = map.zones[item.id];
      if (zone.collapsed) {
        console.log('collapse', item.id);
        map.collapse(item.id);
      }
    });




  map.collapse('paragraph_content');
  console.log('-------');
  // console.log(map.zones);
  map.collapse('paragraph_element');
  console.log('-------');
  // console.log(map.content);
  console.log('-------');
  console.log(map.zones);

  // map.edit('paragraph_content');
  map.expand('paragraph_element');
  map.expand('paragraph_content');
  // map.expand('paragraph_element');
  console.log('-------');
  console.log(map.content);
  // map.collapse('img_element');

  // map.modify('header_content', 9, 9, 9, 17, '55555');

  // map.expand('button_content');

  // console.log('-------');
  // console.log(map.content);
  // console.log('-------');
  // console.log(map.zones);

  // collapse each zones to create the default state
  let didCollapse;
  _.each(zones, (zone, id) => {
    zone.id = id;
    if (zone.collapsed) {
      didCollapse = true;
      map.collapse(id);
    }
  });

  // update the file
  if (didCollapse) {
    // console.log('gen', map.content);
    $fs.writeFileSync(path, map.content);
  }

  // update each of the zones
  _.each(map.zones, (zone, id) => {
    zones[id] = map.zones[id];
  });

}


// NOT PROCESSING SNIPPETS FOR NOW? Needed?
// process the snippet files
function processSnippetZone(zone, id, manifest) {

  // const snippet = manifest.snippets[id];
  // const { content } = snippet;
  // const result = applyCollapsedZones(zone, content)
  // snippet.content = result.updated;

}


// // fixes all collapsed zones
// function applyCollapsedZones(zone, content) {
//   let didCollapse;

//   // give everything an index to start
//   _.each(zone, (marker, id) => {
//     marker.startIndex = getIndex(content, marker.start.row, marker.start.col);
//     marker.endIndex = getIndex(content, marker.end.row, marker.end.col);
//   });


//   // process each zone
//   _.each(zone, (marker, id) => {
//     if (!marker.collapsed) return;
//     didCollapse = true;

//     // get the adjustment
//     const length = marker.endIndex - marker.startIndex;

//     // adjust the content
//     marker.content = content.substr(marker.startIndex, length);
//     content = content.substr(0, marker.startIndex) + content.substr(marker.endIndex);

//     // collapse as required
//     marker.endIndex = marker.startIndex;

//     // shift all zones after this one
//     _.each(zone, (otherMarker, otherId) => {
//       if (otherId === id) return;

//       // shift the zone if it's after this marker
//       if (otherMarker.startIndex > marker.startIndex) {
//         otherMarker.startIndex -= length;
//         otherMarker.endIndex -= length;
//       }

//     });

//   });

//   // finally, fix all zones
//   _.each(zone, (marker, id) => {
//     marker.start = getPosition(content, marker.startIndex);
//     marker.end = getPosition(content, marker.endIndex);
//     delete marker.startIndex;
//     delete marker.endIndex;
//   });

//   return { didCollapse, updated: content };
// }


// // determine the index
// function getIndex(str, row, column) {
//   const lines = str.split(/\n/g);
//   let total = lines[row].substr(0, column).length;
//   for (let i = 0; i < row; i++)
//     total += lines[i].length + 1; // one extra for the newline
//   return total;
// }


// // determine the position
// function getPosition(str, index) {
//   str = str.substr(0, index);
//   const lines = str.split(/\n/g);
//   return { row: lines.length - 1, col: lines[lines.length - 1].length };
// }

