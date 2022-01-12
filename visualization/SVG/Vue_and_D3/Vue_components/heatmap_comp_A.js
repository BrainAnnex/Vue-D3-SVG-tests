Vue.component('vue-heatmap-a',
    /*  A heatmap
     */
    {
        props: ['my_groups', 'my_vars', 'my_data', 'margins'],
        /*
         */

        template: `
            <!-- Outer container box, serving as Vue-required template root  -->
            <svg width='450' height='450'>
                <rect x="0" y="195" width="130" height="195" style="fill: rgb(211, 233, 228)"></rect>
                <g opacity="1" transform="translate(65,0)">
                    <text y="9" dy="0.71em">HELLO</text>
                </g>
            </svg>		<!-- End of outer container box -->
            `,


        data: function() {
            return {
                width:  450 - this.margins.left - this.margins.right,
                height: 450 - this.margins.top - this.margins.bottom
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
                alert("here");
                // Build X scales and axis:
                const x = d3.scaleBand()
                        .range([ 0, this.width ])
                        .domain(this.my_groups);

                const result = d3.axisBottom(x);
                console.log(result);

                return d3.axisBottom(x);


                //return "TBA";

                const width = 450 - this.margins.left - this.margins.right;
                const height = 450 - this.margins.top - this.margins.bottom;


                const svg = d3.selectAll()
                        .append("svg")
                            .attr("width", width + this.margins.left + this.margins.right)
                            .attr("height", height + this.margins.top + this.margins.bottom)
                        .append("g")
                            .attr("transform", `translate(${this.margins.left},${this.margins.top})`);


                return svg;




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