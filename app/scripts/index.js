
// declare variables for api
let req, json, year, time, newTime;
const dataset = [];
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// retrieve data from api
req = new XMLHttpRequest();
req.open('GET', url, true);
req.send();
req.onload = function() {
    // parse JSON data
    json = JSON.parse(req.responseText);

    // loop through data and create new object for each cyclist
    json.forEach((cyclist) => {
        year = Date.parse(cyclist.Year);
        time = cyclist.Time.split(":");
        newTime = new Date();
        newTime.setMinutes(time[0]);
        newTime.setSeconds(time[1]);

        dataset.push({
            time: newTime,
            year: year,
            name: cyclist.Name
        });
    });

    // declare chart dimensions
    const width = 1080;
    const height = 600;
    const padding = 35;

    // create svg area
    const svg = d3.select('#container')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

    // declare scales
    const xScale = d3.scaleLinear()
                    .domain([d3.min(dataset, (d) => d.year), d3.max(dataset, (d) => d.year)])
                    .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
                    .domain([d3.max(dataset, (d) => d.time), d3.min(dataset, (d) => d.time)])
                    .range([height - padding, padding]);

    // input data to chart
    svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d.year))
        .attr('cy', (d) => yScale(d.time))
        .attr('r', (d) => 5)
        .attr('class', 'dot')
        .attr('data-xvalue', (d) => d.year)
        .attr('data-yvalue', (d) => d.time);

    // create chart axes
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat('%Y'));
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'));

    // append axes to svg
    svg.append('g')
    .attr('transform', `translate(0, ${height - padding})`)
    .attr('id', 'x-axis')
    .call(xAxis);

    svg.append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis);
}