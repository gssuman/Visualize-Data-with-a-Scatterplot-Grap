const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

const margin = {
  t: 80,
  b: 80,
  l: 60,
  r: 40 };


const w = 900 - margin.l - margin.r;
const h = 600 - margin.t - margin.b;

// Define the tooltip
var tooltip = d3.select('body').append('div').
attr('class', 'tooltip').
attr('id', 'tooltip').
style('opacity', 0);

const svg = d3.select('body').
append('svg').
attr('height', h + margin.t + margin.b).
attr('width', w + margin.l + margin.r).
attr('class', 'graph');

svg.append('text').
attr("id", "title").
attr('x', w / 2 + margin.l).
attr('y', margin.t / 2).
text('Doping in Professional Bicycle Racing').
attr('text-anchor', 'middle').
style('font-size', '2em');

svg.append('text').
attr('x', w / 2 + margin.l).
attr('y', margin.t - 10).
text('35 Fastest times up Alpe d\'Huez').
attr('text-anchor', 'middle').
style('font-size', '1.2em');

d3.json(url).then(data => {
  // 	x axis
  const yearsDate = data.map(obj => obj.Year);
  const xMax = d3.max(yearsDate) + 1;
  const xMin = d3.min(yearsDate) - 1;

  const xScale = d3.scaleLinear().
  domain([xMin, xMax]).
  range([0, w]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  svg.append('g').
  call(xAxis).
  attr('id', 'x-axis').
  attr('transform', 'translate(' + margin.l + ',' + (h + margin.t) + ')');
  // 	y axis
  const timeDate = data.map(obj => {
    let parsedTime = obj.Time.split(':');
    obj.Time = new Date(Date.UTC(2019, 1, 15, 0, parsedTime[0], parsedTime[1]));
    return obj.Time;
  });
  const yMax = d3.max(timeDate);
  const yMin = d3.min(timeDate);

  const yScale = d3.scaleTime().
  domain([yMin, yMax]).
  range([0, h]);


  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

  svg.append('g').
  call(yAxis).
  attr('id', 'y-axis').
  attr('transform', 'translate(' + margin.l + ',' + margin.t + ')');

  const color = d3.scaleOrdinal(d3.schemeDark2);

  const timeFormat = d3.timeFormat("%M:%S");

  svg.selectAll('circle').
  data(data).
  enter().
  append('circle').
  attr('cx', d => xScale(d.Year) + margin.l).
  attr('cy', d => yScale(d.Time) + margin.t).
  attr('r', 5).
  attr('class', 'dot').
  style("fill", d => color(d.Doping != '')).
  style('stroke', '#000').
  style('opacity', .6).
  attr('data-xvalue', d => d.Year).
  attr('data-yvalue', d => d.Time.toISOString()).
  on('mouseover', d => {
    tooltip.style('opacity', .7);
    tooltip.attr('data-year', d.Year);
    tooltip.html(`${d.Name} : ${d.Nationality} </br>
			Year: ${d.Year}, Time: ${timeFormat(d.Time)} 
			${d.Doping ? "<br/><br/>" + d.Doping : ""}`).
    style("left", d3.event.pageX + "px").
    style("top", d3.event.pageY - 25 + "px");
  }).
  on('mouseout', d => {
    tooltip.style('opacity', 0);
  });

  const legend = svg.selectAll(".legend").
  data(color.domain()).
  enter().append("g").
  attr('id', 'legend').
  attr('transform', (d, i) => `translate(${margin.l},${h / 2 - i * 30})`);

  legend.append("rect").
  attr('x', w - 18).
  attr('width', 18).
  attr('height', 18).
  style('fill', color);

  legend.append('text').
  attr('x', w - 20).
  attr('y', 13).
  text(d => d ? 'Riders with doping allegations' : 'No doping allegations').
  attr('text-anchor', 'end').
  style('font-size', '.7em');
});