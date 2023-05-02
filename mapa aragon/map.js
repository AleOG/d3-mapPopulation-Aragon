import {
  csv,
  geoMercator,
  geoPath,
  scaleLinear,
  schemeReds,
  scaleOrdinal,
  zoom,
} from 'd3';

import { parseador } from './parseador.js';

import { colorLegend } from './colorLegend.js';

import {
  colorData,
  colorScale,
  numberScale,
} from './color.js';

const csvUrl = [
  'https://gist.githubusercontent.com/',
  'AleOG/',
  '167861566c4468391665993df0cdf68c/',
  'raw/e151675e2a2e4ac605c17d6336d135c98a1deca3/',
  'poblacionAragon.csv',
].join('');

const width = window.innerWidth;
const height = window.innerHeight;

// Define map projection
const projection = geoMercator()
  .translate([width / 2, height / 0.18]) // translate to center of screen. You might have to fiddle with this
  //depending on the size of your screen
  .scale([3150]);

const pathGenerator = geoPath().projection(
  projection
);

let columns = '';
let provinciasAragon = '';

const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'd3-tooltip')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden')
  .style('padding', '10px')
  .style('background', 'rgba(0,0,0,0.6)')
  .style('border-radius', '5px')
  .style('color', 'white');

//llamar al dataset
export const getData = async (
  selection,
  data
) => {
  const dataPoblacion = await csv(
    csvUrl,
    parseador
  );
  columns = dataPoblacion.columns;
  //console.log(dataPoblacion)
  const dataProvinciasAragon = dataPoblacion.filter(
    (data) =>
      [
        'Aragón',
        'Provincia de Zaragoza',
        'Provincia de Huesca',
        'Provincia de Teruel',
      ].includes(data.Lugar_de_residencia)
        ? data
        : null
  );
  provinciasAragon = dataProvinciasAragon;

  function populationPercent(nameProvince) {
    console.log(nameProvince);

    const aragon = provinciasAragon.filter(
      (d) => {
        if (
          d['Lugar_de_residencia'] === 'Aragón'
        ) {
          return d['1_de_enero_2021_Ambos_sexos'];
        }
      }
    );
    const populationAragon =
      aragon[0]['1_de_enero_2021_Ambos_sexos'];

    const provincia = provinciasAragon.filter(
      (d) =>
        d['Lugar_de_residencia'].includes(
          nameProvince
        )
          ? d
          : null
    );

    const populationProvincia =
      provincia[0]['1_de_enero_2021_Ambos_sexos'];

    let population = 'No Data';

    let round = Math.round(
      (populationProvincia / populationAragon) *
        100
    );
    console.log(round);
    return round;
  }

  function getColor(num) {
    let color = colorData(num);
    console.log(color);
    return color;
  }

  const comarcas = data.features.filter(
    (comarca) =>
      comarca.properties.ccaa === 'Aragón'
        ? comarca
        : null
  );

  selection
    .append('g')
    .selectAll('path')
    .data(comarcas)
    .join('path')
    .attr('class', 'ccaa')
    .attr('fill', '#d6ebff')
    .attr('stroke', 'black')
    .style('fill', (d) =>
      getColor(
        populationPercent(d.properties.provincia)
      )
    )
    .attr('stroke-width', 0.5)
    .attr('d', pathGenerator)
    .on('mouseover', function (event, data) {
      let porcentage = populationPercent(
        data.properties.provincia
      );
      tooltip
        .html(
          `${data.properties.provincia}: ${
            porcentage + ' %'
          }`
        )
        .style('visibility', 'visible');
    })
    .on('mousemove', function () {
      tooltip
        .style('top', event.pageY - 10 + 'px')
        .style('left', event.pageX + 50 + 'px');
    })
    .on('mouseout', function () {
      tooltip.style('visibility', 'hidden');
    });

  const colors = colorScale();
  const range = numberScale();

  const scale = scaleOrdinal()
    .domain(range)
    .range(colors);

  selection.call(colorLegend, {
    colorScale: scale,
    colorLegendLabel:
      'Population Distribution in Aragón (2021)',
    colorLegendX: 75,
    colorLegendY: 300,
  });

  const zoom = d3
    .zoom()
    .scaleExtent([1, 10])
    .on('zoom', zoomed);

  selection.call(zoom);

  function zoomed(event) {
    const { transform } = event;
    console.log(transform);
    selection.attr('transform', transform);
  }