import { select } from 'd3';

import { getData } from './map.js';

const width = window.innerWidth;
const height = window.innerHeight;



const svg = select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Replace ./data.json with your JSON feed


fetch('comarcas_spain.json')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    // Work with JSON data here
  svg.call(getData, data)

  //console.log(columns)
  })
  .catch((err) => {
    // Do something for an error here
  console.log(err)
  });
