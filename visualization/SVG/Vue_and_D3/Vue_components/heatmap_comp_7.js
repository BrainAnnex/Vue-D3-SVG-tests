Vue.component('vue-heatmap-7',
    /*  A heatmap.

        Compared to 'vue-heatmap-6', TBA
     */
    {
        props: ['my_groups', 'my_vars', 'my_data', 'outer_width', 'outer_height', 'margins'],
        /*
         */

        template: `
            <!-- Outer container, serving as Vue-required template root  -->
            <svg v-bind:width="outer_width" v-bind:height="outer_height">
                <g id="my_chart" transform="translate(30,30)">

                    <!-- D3 WILL INSERT ITS CODE HERE -->

                </g>
            </svg>
            <!-- End of outer container -->
            `,


        data: function() {
            return {
            }
        }, // data



        mounted() {
            /* Note: the "mounted" Vue hook is invoked later in the process of launching this component;
                     waiting this late is needed to make sure that the 'my_svg_element' SVG element is present in the DOM
             */
            console.log("The `vue-heatmap-7` component has been mounted");

            this.create_plot();
        },


        watch: {
            my_groups()  {
                console.log("The prop `my_data` has changed inside the component `vue-heatmap-7`");
                // No action taken for now
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
                // Locate the <G> element with id "my_chart" in this Vue component
                const chart = d3.select("#my_chart");

                // Insert elements into the <G> element with id "my_chart" in this Vue component

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