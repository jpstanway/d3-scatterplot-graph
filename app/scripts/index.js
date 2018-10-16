
// declare variables for api
let req, json, year, time, newTime, color;
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
        time = cyclist.Time.split(":");
        newTime = new Date();
        newTime.setMinutes(time[0]);
        newTime.setSeconds(time[1]);

        color = !cyclist.Doping ? '#808b3d' : '#483d8b';

        dataset.push({
            time: newTime,
            year: cyclist.Year,
            name: cyclist.Name,
            desc: cyclist.Doping || 'No record of doping',
            country: cyclist.Nationality,
            link: cyclist.URL,
            color: color
        });
    });

    console.log(dataset[0].time);

    // declare chart dimensions
    const width = 1080;
    const height = 600;
    const padding = 35;

    // create tooltip
    const tip = d3.tip()
                .attr('class', 'd3-tip')
                .attr('id', 'tooltip')
                .html((d) => {
                    const time = d3.timeFormat('%M:%S');
                    d3.select('#tooltip').attr('data-year', d.year);

                    return `
                        ${d.name} (${d.country})<br>
                        Time: ${time(d.time)} Year: ${d.year}<br>
                        <br>
                        ${d.desc}
                    `;
                });                 

    // create svg area
    const svg = d3.select('#container')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .call(tip);
           

    // declare scales
    const xScale = d3.scaleLinear()
                    .domain([d3.min(dataset, (d) => d.year), d3.max(dataset, (d) => d.year)])
                    .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
                    .domain([d3.min(dataset, (d) => d.time), d3.max(dataset, (d) => d.time)])
                    .range([padding, height - padding]);

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
        .attr('data-yvalue', (d) => d.time)
        .style('fill', (d) => d.color)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // create and append a legend
    svg.append('rect')
        .attr('id', 'legend')
        .attr('width', 250)
        .attr('height', 100)
        .attr('x', width - padding - 250)
        .attr('y', 0)
        .style('fill', '#efefef');

    svg.append('text')
        .attr('id', 'legend-title')
        .attr('x', width - padding - 150)
        .attr('y', 15)
        .text('Record');    

    // create symbols and append to legend
    svg.append('rect')
        .attr('class', 'symbol')
        .attr('width', 25)
        .attr('height', 25)
        .attr('x', width - padding - 87.5)
        .attr('y', 60)
        .style('fill', '#483d8b');

    svg.append('rect')
        .attr('class', 'symbol')
        .attr('width', 25)
        .attr('height', 25)
        .attr('x', width - padding - 187.5)
        .attr('y', 60)
        .style('fill', '#808b3d');

    svg.append('text')
        .attr('class', 'symbol-text')
        .attr('x', width - padding - 190)
        .attr('y', 50)
        .text('clean');    

    svg.append('text')
        .attr('class', 'symbol-text')
        .attr('x', width - padding - 90)
        .attr('y', 50)
        .text('dirty');    


    // create chart axes
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'));
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