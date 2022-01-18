Vue.component('vue-simple-test-a',
    /* A few connected points, from the passed props, plus a fixed line
     */
    {
        props: ['all_points', 'width', 'height'],
        /*  all_points:
         */

        template: `
            <div  v-html="create_plot()">	    <!-- Outer container box, serving as Vue-required template root  -->

            </div>		<!-- End of outer container box -->
            `,


        data: function() {
            return {
                data1: false,   // NOT used
                data2: 123      // NOT used
            }
        }, // data



        // ---------------------------  METHODS  ---------------------------
        methods: {
        
            create_plot()
            // Uses my svg_plot.js library to generate the SVG code,
            // from the data passed in the props
            {
                let svg_code = new SVGplot(this.width, this.height);

                var old_pnt = null;
                for (let i=0; i < this.all_points.length; i++)  {
                    let pnt = this.all_points[i];
                    svg_code = svg_code.add_point(pnt[0], pnt[1], 3, 'orange');

                    if (i != 0)
                        svg_code = svg_code.add_line(old_pnt[0], old_pnt[1], pnt[0], pnt[1]);

                    old_pnt = pnt;
                }

                svg_code = svg_code
                    .add_line(0, 0, 100, 100)
                    .terminate_plot();

                console.log(svg_code);

                return svg_code;
            }

        }  // METHODS

    }
); // end component