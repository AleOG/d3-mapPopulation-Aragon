import { schemeGreens } from 'd3';

export function colorData(num) {
  switch (true) {
    case num >= 100:
      return d3.schemeGreens[6][5];
      break;
    case num > 80:
      return d3.schemeGreens[6][4];
      break;
    case num > 60:
      return d3.schemeGreens[6][3];
      break;
    case num > 40:
      return d3.schemeGreens[6][2];
      break;
    case num > 20:
      return d3.schemeGreens[6][1];
      break;
    case num <= 20:
      return d3.schemeGreens[6][0];
      break;
    default:
      return '#eee';
      break;
  }
}

export function colorScale() {
  let scale = [];
  scale = scale.concat(d3.schemeGreens[6][4]);
  scale = scale.concat(d3.schemeGreens[6][2]);
  scale = scale.concat(d3.schemeGreens[6][0]);
  scale = scale.concat('#eee');
  return scale;
}

export function numberScale() {
  let scale = [];
  scale = scale.concat('80-100%');
  scale = scale.concat('40-60%');
  scale = scale.concat('0-40%');
  scale = scale.concat('No Data');
  return scale;
}
