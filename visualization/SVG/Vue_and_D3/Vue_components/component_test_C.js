Vue.component('vue-simple-test-d',
    /*  A bar chart, utilizing SVG code entirely generated programmatically by JavaScript,
        using the "d3-scale" library
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
            /* Uses my svg-plot.js library to generate the SVG code,
               from the data passed in the props,
               and the "d3-scale" library to convert from real to screen coordinates
             */
            {
                /* Make use of the "d3-scale" library to convert from real to screen coordinates
                 */
                const xScale = d3.scaleBand()
                    .domain(this.data_1.map( dp => dp.region ))
                    .rangeRound([0, 250])
                    .padding(0.1);
                // Note: this.data_1.map( dp => dp.region ) returns an array of country names

                // To map [0, 15] onto [200, 0]
                const yScale = d3.scaleLinear()
                    .domain([0, 15])
                    .range([200, 0]);

                console.log("Examples of xScale() function:");
                console.log(xScale('USA'), xScale('Italy'), xScale('Malta'), xScale('Germany'));

                console.log("Examples of yScale() function:");
                console.log(yScale(0.));
                console.log(yScale(1.));
                console.log(yScale(2.));
                console.log(yScale(3.));

                /* Start assembling the SVG code */
                let svg_code = new SVGplot(this.width, this.height);

                for (let i=0; i < this.data_1.length; i++)  {
                    let dt = this.data_1[i];

                    let width = 54;
                    let height = 200 - yScale(dt.value);

                    let x = xScale(dt.region);
                    let y = yScale(dt.value);

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