Vue.component('vue-heatmap-4',
    /*  A heatmap.
        Note that this component receives data from its parent, but is NOT reactive:
        the mounted() function gets called once, and that's the end of it!
        There's a watch() function for 'my_data', but it's not used.

        Compared to 'vue-heatmap-3', this component
        takes control of computed values and of most functions used by the original D3 code,
        except for the axes.  The DOM manipulation is still being done by D3.
     */
    {
        props: ['my_groups', 'my_vars', 'my_data', 'outer_width', 'outer_height', 'margins'],
        /*
            my_data:    array of objects with 3 keys ('group', 'variable' and 'value')
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
            console.log("The `vue-heatmap-4` component has been mounted");

            this.create_plot();
        },


        watch: {
            my_data()
            // Example of watching for changes in props...  but no action is taken
            {
                console.log("The prop `my_data` has changed inside the component `vue-heatmap-4`");
                //this.create_plot();   // This won't work, because create_plot() only ADDS elements
            }
        },


        // ---------------------------  COMPUTED  ---------------------------
        computed: {

            width()
            {
                return this.outer_width - this.margins.left - this.margins.right;
            },

            height()
            {
                return this.outer_height - this.margins.top - this.margins.bottom;
            },

            x_scale()
            // Build the X scale.  This returns a function
            {
                return d3.scaleBand()
                        .range([ 0, this.width ])
                        .domain(this.my_groups);
            },

            y_scale()
            // Build the Y scale.  This returns a function
            {
                return d3.scaleBand()
                       .range([ this.height, 0 ])
                       .domain(this.my_vars);
            },

            color_scale()
            // Build the color scale.  This returns a function
            {
                return d3.scaleLinear()
                    .range(["white", "#69b3a2"])
                    .domain([1,100]);
            }

        },  // COMPUTED

        // ---------------------------  METHODS  ---------------------------
        methods: {
        
            create_plot()
            /*
             */
            {
                // Insert an svg object into the <DIV> element with id "my_dataviz" in this Vue component
                //d3.selectAll('svg').remove();     // Attempting a "clean start" gives mixed results
                const chart_container = d3.select("#my_dataviz")
                                          .append("svg")
                                          .attr("width", this.outer_width)
                                          .attr("height", this.outer_height);

                const chart = chart_container.append("g")
                                             .attr("transform", `translate(${this.margins.left},${this.margins.top})`);


                var x_scale_func = this.x_scale;   // This is a function
                var y_scale_func = this.y_scale;   // This is a function

                // Build the X axis
                chart.append("g")
                     .attr("transform", `translate(0, ${this.height})`)
                     .call(d3.axisBottom(x_scale_func));

                // Build Y axis
                chart.append("g")
                     .call(d3.axisLeft(y_scale_func));

                var color_func = this.color_scale;   // This is a function


                // Transform the DOM element with the SVG
                chart.selectAll()
                        .data(this.my_data, function(d) {return d.group+':'+d.variable;})
                        .join("rect")
                        .attr("x", function(d) { return x_scale_func(d.group) })
                        .attr("y", function(d) { return y_scale_func(d.variable) })
                        .attr("width", x_scale_func.bandwidth() )
                        .attr("height", y_scale_func.bandwidth() )
                        .style("fill", function(d) { return color_func(d.value)} );

            }  // create_plot

        }  // METHODS

    }
); // end component