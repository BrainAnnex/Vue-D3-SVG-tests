Vue.component('vue-arc',
    /*
        Create a part of an SVG plot, consisting of a filled double arc.
        Based on https://www.youtube.com/watch?v=CkFktv0p3pw
     */
    {
        props: ['inner_radius', 'outer_radius', 'corner_radius', 'start_angle', 'end_angle', 'color'],
        /*
         */

        template: `
            <!-- Outer container, serving as Vue-required template root  -->
            <path
                v-bind:fill="color"
                v-bind:d="path_data_arc"
                transform="translate(150, 150)"
            />
            <!-- End of outer container -->
            `,


        data: function() {
            return {
            }
        },  // data


        // ---------------------------  COMPUTED  ---------------------------
        computed: {

            path_data_arc()
            /* Return a string suitable as a value the "d" attribute of the SVG <path> element
             */
            {
                const arc_func = d3.arc()
                                    .innerRadius(this.inner_radius)
                                    .outerRadius(this.outer_radius)
                                    .cornerRadius(this.corner_radius)
                                    .startAngle(this.start_angle)
                                    .endAngle(this.end_angle);      // This will be a function

                return arc_func();
            }

        },  // COMPUTED


        // ---------------------------  METHODS  ---------------------------
        methods: {

        }  // METHODS

    }
); // end component