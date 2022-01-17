/*  Bar graph and a CHECKBOX UI, all handled by D3.js
    Based on https://www.youtube.com/watch?v=aHJCt2adSWA
 */


// START OF DATA SECTION
const DATA_1 = [
    {id: 'd1', index: 0, value: 10, region:'USA'},
    {id: 'd2', index: 1, value: 11, region:'Italy'},
    {id: 'd3', index: 2, value: 12, region:'Malta'},
    {id: 'd4', index: 3, value: 6, region:'Germany'}
];


const MARGINS = {top: 20, bottom: 10};
const CHART_WIDTH = 600;

// END OF DATA SECTION


const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;

let selected_data = DATA_1;


/* Prepare some D3 functions
 */
const x_scale = d3.scaleBand()
    .domain(DATA_1.map( dp => dp.region ))
    .rangeRound([0, CHART_WIDTH])
    .padding(0.1);

const y_scale = d3.scaleLinear()
    .domain([0, d3.max(DATA_1, dp => dp.value) + 3])
    .range([CHART_HEIGHT, 0]);


/* From here below, D3 reaches into the DOM,
   and directly manipulates it
 */
const chart_container = d3
    .select('svg')
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);


const chart = chart_container.append('g');

chart_container.append('g')
    .call(d3.axisBottom(x_scale).tickSizeOuter(0))
    .attr('transform', `translate(0, ${CHART_HEIGHT})`)
    .attr('color', '#4f009e')

// translate() is a CSS function


function render_chart()
{
    chart.selectAll('.bar')
        .data(selected_data, dp => dp.id)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('width', x_scale.bandwidth())
        .attr('height', dt => CHART_HEIGHT - y_scale(dt.value))
        .attr('x', dt => x_scale(dt.region))
        .attr('y', dt => y_scale(dt.value));

    chart.selectAll('.bar')
        .data(selected_data, dp => dp.id)
        .exit()
        .remove();


    // Bar height values shown above the bars
    chart.selectAll('.label')
        .data(selected_data, dp => dp.id)
        .enter()
        .append('text')
        .classed('label', true)
        .text(dp => dp.value)
        .attr('x', dt => x_scale(dt.region) + x_scale.bandwidth() / 2)
        .attr('y', dt => y_scale(dt.value) - 20)
        .attr('text-anchor', 'middle');

    chart.selectAll('.label')
        .data(selected_data, dp => dp.id)
        .exit()
        .remove();
}

render_chart();



/* The remainder of the code, below,
   is to use D3 to implement a checkbox UI
 */

let unselected_ids = [];


const list_items = d3
    .select('#data')
    .select('ul')
    .selectAll('li')
    .data(DATA_1, dp => dp.id)
    .enter()
    .append('li')
    .append('span')
    .text(dp => dp.region)
    .append('input')
    .attr('type', 'checkbox')
    .attr('checked', true)
    .attr('id', dp => dp.id)
    .on('change', event => {
        console.log(event.target);
        var clicked_id = event.target.id;

        if (unselected_ids.indexOf(clicked_id) === -1) {
            unselected_ids.push(clicked_id);
        }
        else {
            unselected_ids = unselected_ids.filter(id => (id !== clicked_id));
        }
        console.log(unselected_ids);

        selected_data = DATA_1.filter(
            dp => (unselected_ids.indexOf(dp.id) === -1)
        );
        console.log(selected_data);

        render_chart();
    });

/* NOTE: the line
        .attr('id', dp => dp.id)
        is optional.
        But, if not used, inside the on() event handler,
        one must use:
            var clicked_id = event.target.__data__.id;
 */
