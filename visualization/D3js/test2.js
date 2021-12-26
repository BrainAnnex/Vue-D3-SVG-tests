// Based on https://www.youtube.com/watch?v=TOJ9yjvlapY

const DATA_1 = [
    {id: 'd1', index: 0, value: 10, region:'USA'},
    {id: 'd2', index: 1, value: 11, region:'Italy'},
    {id: 'd3', index: 2, value: 12, region:'Malta'},
    {id: 'd4', index: 3, value: 6, region:'Germany'}
];


// -------------   First, using coordinate transformation computed by us:   ------------

const container = d3.select('.svg1')
    .classed('container', true)

const bars = container
    .selectAll('.bar')
    .data(DATA_1)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('width', '54')
    .attr('height', dt => (dt.value * 15))
    .attr('x', dt => 8 + (dt.index * 60))
    .attr('y', dt => 200 - (dt.value * 15));


// -------------   Then, using D3-scale:   ------------

const xScale = d3.scaleBand()
    .domain(DATA_1.map( dp => dp.region ))
    .rangeRound([0, 250])
    .padding(0.1)

const yScale = d3.scaleLinear()
    .domain([0, 15])
    .range([200, 0])


const container2 = d3.select('.svg2')
    .classed('container', true)

const bars2 = container2
    .selectAll('.bar')
    .data(DATA_1)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('width', xScale.bandwidth())
    .attr('height', dt => 200 - yScale(dt.value))
    .attr('x', dt => xScale(dt.region))
    .attr('y', dt => yScale(dt.value))

setTimeout( () => {
    bars2
    .data(DATA_1.slice(0,2))
    .exit()
    .remove();
}, 5000);   // After 5 secs, make the last 2 bars disappear



