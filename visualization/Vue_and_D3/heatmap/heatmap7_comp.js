Vue.component('vue-heatmap-7',
    /*  A heatmap.

        Compared to 'vue-heatmap-6', most of the plot (except the axes) is done
        in the SVG element in the Vue template,
        using Vue iteration over the heatmap rectangles,
        and computations of plot parameters with D3 functions.

        The axes remain a DOM manipulation directly done by D3, and require special
        handling to be reactive to changes in the data (while the Vue-controlled part
        is automatically reactive.)
     */
    {
        props: ['my_groups', 'my_vars', 'my_data', 'outer_width', 'outer_height', 'margins'],
        /*
            my_data:    array of objects with 3 keys ('group', 'variable' and 'value')
         */

        template: `
            <!-- Outer container, serving as Vue-required template root  -->
            <svg v-bind:width="outer_width" v-bind:height="outer_height" class="chart-holder">
                <g v-bind:transform="'translate(' + margins.left + ',' + margins.top + ')'">

                    <g class="heatmap">
                        <rect v-for="(item, index) in my_data"
                            v-bind:key="index"
                            v-bind:x="rect_x(item)"  v-bind:y="rect_y(item)"
                            v-bind:width="rect_w"  v-bind:height="rect_h"
                            v-bind:fill="rect_color(item)"
                        >
                        </rect>
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
            }
        }, // data



        mounted() {
            /* Note: the "mounted" Vue hook is invoked later in the process of launching this component;
                     waiting this late is needed to make sure that the 'my_svg_element' SVG element is present in the DOM
             */
            console.log("The `vue-heatmap-7` component has been mounted");

            this.create_axes();
        },


        watch: {    // NOTE: special actions are needed for data reactivity with the axes (directly handled by D3);
                    //       by contrast, data reactivity with the heatmap itself (the rectangles) is automatically
                    //       taken care of by Vue
            outer_width()  {
                console.log("The prop `outer_width` has changed inside the component `vue-heatmap-7`");
                this.create_axes();
            },

            outer_height()  {
                console.log("The prop `outer_height` has changed inside the component `vue-heatmap-7`");
                this.create_axes();
            },

            margins()  {
                console.log("The prop `margins` has changed inside the component `vue-heatmap-7`");
                this.create_axes();
            }

        },  // watch


        // ---------------------------  COMPUTED  ---------------------------
        computed: {     // NOTE: computed methods are only invoked AS NEEDED

            width()
            {
                return this.outer_width - this.margins.left - this.margins.right;
            },

            height()
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
                            .range([ 0, this.width ]);     // f is a function
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
                            .range([ this.height, 0 ]);   // f is a function
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
            }

        },  // COMPUTED


        // ---------------------------  METHODS  ---------------------------
        methods: {

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
                     .attr("transform", `translate(0, ${this.height})`)
                     .call(d3.axisBottom(this.x_scale_func));

                // Build Y axis
                axes.append("g")
                    .call(d3.axisLeft(this.y_scale_func));

            }  // create_axes

        }  // METHODS

    }
); // end component