Vue.component('vue-heatmap-3',
    /*  A heatmap.
        Note that this component receives data from its parent, but is NOT reactive:
        the mounted() function gets called once, and that's the end of it!
        The heatmap is still entirely produced, and inserted into the DOM, by D3
     */
    {
        props: ['my_groups', 'my_vars', 'my_data', 'outer_width', 'outer_height', 'margins'],
        /*
         */

        template: `
            <!-- Outer container, serving as Vue-required template root  -->
            <div id="my_dataviz">

                <!-- D3 WILL INSERT ITS CODE HERE -->

            </div>		<!-- End of outer container -->
            `,


        data: function() {
            return {
            }
        }, // data



        mounted() {
            /* Note: the "mounted" Vue hook is invoked later in the process of launching this component;
                     waiting this late is needed to make sure that the 'my_dataviz' DIV element is present in the DOM
             */
            console.log("the `vue-heatmap-3` component has been mounted");

            this.create_plot();
        },



        // ---------------------------  METHODS  ---------------------------
        methods: {
        
            create_plot()
            /*
             */
            {
                const width = this.outer_width - this.margins.left - this.margins.right,
                      height = this.outer_height - this.margins.top - this.margins.bottom;

                console.log("width, height: ", width, height);


                // Append the svg object to the <DIV> element in this Vue component
                const svg = d3.select("#my_dataviz")
                        .append("svg")
                            .attr("width", width + this.margins.left + this.margins.right)
                            .attr("height", height + this.margins.top + this.margins.bottom)
                        .append("g")
                            .attr("transform", `translate(${this.margins.left},${this.margins.top})`);


                // Build X scale and axis
                const x = d3.scaleBand()
                        .range([ 0, width ])
                        .domain(this.my_groups);

                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x));

                // Build Y scale and axis
                const y = d3.scaleBand()
                    .range([ height, 0 ])
                    .domain(this.my_vars);

                svg.append("g")
                    .call(d3.axisLeft(y));

                // Build the color scale
                const myColor = d3.scaleLinear()
                    .range(["white", "#69b3a2"])
                    .domain([1,100]);


                // Transform the DOM element with the SVG
                svg.selectAll()
                        .data(this.my_data, function(d) {return d.group+':'+d.variable;})
                        .join("rect")
                        .attr("x", function(d) { return x(d.group) })
                        .attr("y", function(d) { return y(d.variable) })
                        .attr("width", x.bandwidth() )
                        .attr("height", y.bandwidth() )
                        .style("fill", function(d) { return myColor(d.value)} );

            }  // create_plot

        }  // METHODS

    }
); // end component