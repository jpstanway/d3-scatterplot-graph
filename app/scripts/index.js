
// data input
const dataset = [
    [2006, 40],
    [2005, 35],
    [2004, 30],
    [2001, 25],
    [2000, 20]
];

// declare chart dimensions
const width = 1080;
const height = 600;
const padding = 20;

// create svg area
const svg = d3.select('#container')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

// declare scales
const xScale = d3.scaleLinear()
                 .domain([d3.min(dataset, (d) => d[0]), d3.max(dataset, (d) => d[0])])
                 .range([padding, width - padding]);

const yScale = d3.scaleLinear()
                 .domain([0, d3.max(dataset, (d) => d[1])])
                 .range([height - padding, padding]);

// input data to chart
svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d[0]))
    .attr('cy', (d) => yScale(d[1]))
    .attr('r', (d) => 5)
    .attr('class', 'dot')
    .attr('data-xvalue', (d) => d[0])
    .attr('data-yvalue', (d) => d[1]);

// create chart axes
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisRight(yScale);

// append axes to svg
svg.append('g')
   .attr('transform', `translate(0, ${height - padding})`)
   .attr('id', 'x-axis')
   .call(xAxis);

svg.append('g')
   .attr('transform', 'translate(0, 0)')
   .attr('id', 'y-axis')
   .call(yAxis);

