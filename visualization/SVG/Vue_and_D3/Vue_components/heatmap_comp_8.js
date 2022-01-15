Vue.component('vue-heatmap-8',
    /*  A heatmap.

        Compared to 'vue-heatmap-7', TBA
     */
    {
        props: ['my_groups', 'my_vars', 'my_data', 'outer_width', 'outer_height', 'margins'],
        /*
         */

        template: `
            <!-- Outer container, serving as Vue-required template root  -->
            <svg v-bind:width="outer_width" v-bind:height="outer_height" class="chart-holder">
                <g v-bind:transform="translate(margins.left, margins.top)">

                    <g class="heatmap">
                        <rect v-for="(item, index) in my_data"
                            v-bind:key="index"
                            v-bind:x="rect_x(item)"  v-bind:y="rect_y(item)"
                            v-bind:width="rect_w"  v-bind:height="rect_h"
                            v-bind:fill="rect_color(item)"
                        >
                        </rect>
                    </g>

                    <g class="test">
                        <line x1='0' y1='111' x2='390' y2='111' stroke='red'/>
                        <line x1='0' y1='140' x2='390' y2='140' stroke='purple'/>
                    </g>

                    <g class="x-axis-test-1" v-html="foo(0, 150, 390, 150)">
                    </g>

                    <g class="x-axis-test-2" v-html="this.svg_helper.line(0, 230, 390, 230, 'blue')">
                    </g>

                    <g class="x-axis-test-1" v-html="X_axis">
                    </g>

                    <g id="chart_axes">
                        <!-- D3 WILL INSERT ITS CODE HERE for the chart axes -->
                    </g>
                    
                </g>
            </svg>
            <!-- End of outer container -->
            `,


        data: function() {
            return {
                svg_helper: new SVGhelper()
            }
        }, // data



        mounted() {
            /* Note: the "mounted" Vue hook is invoked later in the process of launching this component;
                     waiting this late is needed to make sure that the 'my_svg_element' SVG element is present in the DOM
             */
            console.log("The `vue-heatmap-8` component has been mounted");

            this.create_axes();

            //this.svg_helper = new SVGhelper();
        },



        // ---------------------------  COMPUTED  ---------------------------
        computed: {     // NOTE: computed methods are only invoked AS NEEDED

            plot_width()
            {
                return this.outer_width - this.margins.left - this.margins.right;
            },

            plot_height()
            {
                return this.outer_height - this.margins.top - this.margins.bottom;
            },


            x_scale_func()
            /*  Create and return a function to build the X scale.
                This function maps a "group" name (in my_data) into an X value in screen coordinates.
                EXAMPLE:  "A" |-> 0  , "B" |-> 130 , "C" |-> 260
             */
            {
                const f = d3.scaleBand()
                            .domain(this.my_groups)
                            .range([ 0, this.plot_width ]);     // f is a function
                return f;
            },

            y_scale_func()
            /*  Create and return a function to build the Y scale.
                This function maps a "variable" name (in my_data) into a Y value in screen coordinates
                EXAMPLE:  "v1" |-> 195  , "v2" |-> 0
             */
            {
                const f = d3.scaleBand()
                            .domain(this.my_vars)
                            .range([ this.plot_height, 0 ]);   // f is a function
                return f;
            },

            color_scale_func()
            /*  Create and return a function to build the color scale.
                This returns maps a number ("value" in my_data) into a color code
                EXAMPLES:  0 |-> "rgb(255, 255, 255)"  , 10 |-> "rgb(240, 247, 246)" , 100 |-> "rgb(105, 179, 162)"
             */
            {
                const f = d3.scaleLinear()
                    .domain([0,100])
                    .range(["white", "#69b3a2"]);   // Maps 0 to white, and 100 to "#69b3a2" (medium green)

                return f;   // f is a function
            },


            rect_w()
            {
                return this.x_scale_func.bandwidth();
            },

            rect_h()
            {
                return this.y_scale_func.bandwidth();
            },

            X_axis()
            // Return the SVG code to produce an x-axis
            {
                return this.svg_helper.axis_test(
                            {Sxmin: 0, Sxmax: this.plot_width,
                             Sy_axis: 260,
                             color: "brown"
                            }
                        );
               // return this.svg_helper.line(0, 260, 390, 260, "brown");
            }

        },  // COMPUTED


        // ---------------------------  METHODS  ---------------------------
        methods: {

            foo(Sx1, Sy1, Sx2, Sy2)
            {
                //return "<line x1='0' y1='150' x2='390' y2='150' stroke='green'/>";
                return this.svg_helper.line(Sx1, Sy1, Sx2, Sy2, "yellow");
            },

            translate(x, y)
            /*  Return a string suitable as an SVG attribute, to indicate a translation by <x,y>
                EXAMPLE:   "translate(10, 50)"
             */
            {
                return `translate(${x}, ${y})`;
            },

            rect_x(item)
            {
                return this.x_scale_func(item.group);
            },
            rect_y(item)
            {
                return this.y_scale_func(item.variable);
            },


            rect_color(item)
            {
                var color_func = this.color_scale_func;   // This is a function
                return color_func(item.value);
            },


            create_axes()
            /*  Perform DOM manipulation: locate the <G> element with id "chart_axes" in this Vue component,
                empty out anything already present (to allow for multiple calls to react to changes in data),
                and insert into it SVG elements to create the 2 plot axes
             */
            {
                // Locate the <G> element with id "chart_axes" in this Vue component
                const axes = d3.select("#chart_axes");

                axes.selectAll('g').remove();

                /* Insert into it SVG elements to create the 2 plot axes
                 */

                // Build the X axis.  The translation is to place it below the plot
                axes.append("g")
                     .attr("transform", `translate(0, ${this.plot_height})`)
                     .call(d3.axisBottom(this.x_scale_func));

                // Build Y axis
                axes.append("g")
                    .call(d3.axisLeft(this.y_scale_func));

            }  // create_axes

        }  // METHODS

    }
); // end component