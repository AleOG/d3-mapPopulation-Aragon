export const colorLegend = (
  selection,
  {
    colorScale,
    colorLegendLabel,
    colorLegendX,
    colorLegendY,
    tickSpacing = 15,
    tickPadding = 10,
    colorLegendLabelX = -10,
    colorLegendLabelY = -20,
  }
) => {
  const legend = selection
    .selectAll('g.colorLegend')
    .data([null])
    .join('g')
    .attr(
      'transform',
      `translate(${colorLegendX},${colorLegendY})`
    );

  legend
    .selectAll('text.color-legend-label')
    .data([null])
    .join('text')
    .attr('x', colorLegendLabelX)
    .attr('y', colorLegendLabelY)
    .attr('class', 'color-legend-label')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 12)
    .text(colorLegendLabel);

  legend
    .selectAll('g.tick')
    .data(colorScale.domain())
    .join((enter) =>
      enter
        .append('g')
        .attr('class', 'tick')
        .call((selection) => {
          selection.append('circle');
          selection.append('text');
        })
    )
    .attr(
      'transform',
      (d, i) => `translate(0, ${i * tickSpacing})`
    )
    .attr('font-size', 10)
    .attr('font-family', 'sans-serif')
    .call((selection) => {
      selection
        .select('circle')
        .attr('r', 4)
        .attr('fill', colorScale)
        .attr('stroke', '#000')
        .attr('stroke-width', 0.5);
      selection
        .select('text')
        .attr('dy', '0.32em')
        .attr('x', tickPadding)
        .text((d) => d);
    });
};
