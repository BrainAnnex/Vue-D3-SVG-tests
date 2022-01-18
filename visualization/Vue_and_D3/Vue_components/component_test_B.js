Vue.component('vue-simple-test-b',
    /*  A bar chart, utilizing SVG code entirely generated programmatically by JavaScript,
        using my svg_plot.js library
     */
    {
        props: ['data_1', 'width', 'height'],
        /*  data_1:
         */

        template: `
            <div  v-html="create_plot()" class='container'>	    <!-- Outer container box, serving as Vue-required template root  -->

            </div>		<!-- End of outer container box -->
            `,


        data: function() {
            return {
                example: false   // NOT used
            }
        }, // data



        // ---------------------------  METHODS  ---------------------------
        methods: {
        
            create_plot()
            // Uses my svg_plot.js library to generate the SVG code,
            // from the data passed in the props
            {
                let svg_code = new SVGplot(this.width, this.height);

                for (let i=0; i < this.data_1.length; i++)  {
                    let dt = this.data_1[i];

                    let width = 54;
                    let height = dt.value * 13.333;
                    let x = 8 + (i * 60);
                    let y = 200 - (dt.value * 13.333);  // To map [0, 15] onto [200, 0]
                    svg_code = svg_code.add_rectangle(x, y, width, height, class_name = 'bar');
                }

                svg_code = svg_code.terminate_plot();
                /*
                svg_code = svg_code
                    .add_line(0, 0, 100, 100)
                    .terminate_plot();
                */
                console.log(svg_code);

                return svg_code;
            }

        }  // METHODS

    }
); // end component