// Non-SVG tests  (just DOM manipulation and CSS)
// Based on https://www.youtube.com/watch?v=TOJ9yjvlapY

d3.select('.div1')
    .selectAll('p')
    .data([1, 2])
    .enter()
    .append('p')
    .text('Hello!');


d3.select('.div2')
    .selectAll('p')
    .data([1, 2, 3])
    .enter()
    .append('p')
    .text(x => "hello " + x);

const DATA_1 = [
    {id: 'd1', value: 10, region:'USA'},
    {id: 'd2', value: 11, region:'Italy'},
    {id: 'd3', value: 12, region:'Malta'},
    {id: 'd4', value: 6, region:'Germany'}
];


d3.select('.div3')
    .selectAll('p')
    .data(DATA_1)
    .enter()
    .append('p')
    .text(x => x.region);


const container = d3.select('.div4')
    .classed('container', true)
    .style('border', '1px solid red');

container.selectAll('.bar')
    .data(DATA_1)
    .enter()
    .append('div')
    .classed('bar', true)
    .style('width', '50px')
    .style('height', x => (x.value *15) + 'px')
