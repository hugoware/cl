import _ from 'lodash';
import $path from 'path';
import $fs from 'fs';

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
function processFileZone(zone, id, source) {

  // get this file path
  let path = id.replace(/\$/g, '.');
  path = $path.resolve(source, `.${path}`);
  let content = $fs.readFileSync(path).toString();

  _.each(zone, (item, id) => {
    _.each(zone, (outer, outerId) => {

      // skip itself
      if (id === outerId) return;

      // if contained within this zone, and the outer zone
      // is also collapsed, then we need to get the offset
      if (!outer.collapsed) return;

      // capture each
      const itemStartIndex = getIndex(content, item.start.row, item.start.col);
      const itemEndIndex = getIndex(content, item.end.row, item.end.col);
      const outerStartIndex = getIndex(content, outer.start.row, outer.start.col);
      const outerEndIndex = getIndex(content, outer.end.row, outer.end.col);

      // check for the containment
      if (itemStartIndex >= outerStartIndex
        && itemEndIndex >= outerStartIndex
        && itemStartIndex < outerEndIndex
        && itemEndIndex < outerEndIndex) {
        item.offset = itemStartIndex - outerStartIndex;
        item.offsetBy = outerId;
      }

    });

  });

  // update the zones
  const result = applyCollapsedZones(zone, content);

  // update the file
  if (result.didCollapse) {
    $fs.writeFileSync(path, result.updated);
  }

}


// process the snippet files
function processSnippetZone(zone, id, manifest) {

  const snippet = manifest.snippets[id];
  const { content } = snippet;
  const result = applyCollapsedZones(zone, content)
  snippet.content = result.updated;

}


// fixes all collapsed zones
function applyCollapsedZones(zone, content) {
  let didCollapse;

  // give everything an index to start
  _.each(zone, (marker, id) => {
    marker.startIndex = getIndex(content, marker.start.row, marker.start.col);
    marker.endIndex = getIndex(content, marker.end.row, marker.end.col);
  });


  // process each zone
  _.each(zone, (marker, id) => {
    if (!marker.collapsed) return;
    didCollapse = true;

    // get the adjustment
    const length = marker.endIndex - marker.startIndex;

    // adjust the content
    marker.content = content.substr(marker.startIndex, length);
    content = content.substr(0, marker.startIndex) + content.substr(marker.endIndex);

    // collapse as required
    marker.endIndex = marker.startIndex;

    // shift all zones after this one
    _.each(zone, (otherMarker, otherId) => {
      if (otherId === id) return;

      // shift the zone if it's after this marker
      if (otherMarker.startIndex > marker.startIndex) {
        otherMarker.startIndex -= length;
        otherMarker.endIndex -= length;
      }

    });

  });

  // finally, fix all zones
  _.each(zone, (marker, id) => {
    marker.start = getPosition(content, marker.startIndex);
    marker.end = getPosition(content, marker.endIndex);
    delete marker.startIndex;
    delete marker.endIndex;
  });

  return { didCollapse, updated: content };
}


// determine the index
function getIndex(str, row, column) {
  const lines = str.split(/\n/g);
  let total = lines[row].substr(0, column).length;
  for (let i = 0; i < row; i++)
    total += lines[i].length + 1; // one extra for the newline
  return total;
}


// determine the position
function getPosition(str, index) {
  str = str.substr(0, index);
  const lines = str.split(/\n/g);
  return { row: lines.length - 1, col: lines[lines.length - 1].length };
}

