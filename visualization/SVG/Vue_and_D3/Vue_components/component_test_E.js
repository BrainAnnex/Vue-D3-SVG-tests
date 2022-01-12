Vue.component('vue-simple-test-e',
    /* A bar chart, utilizing an SVG template, with iterations by Vue,
       using parameters computed with the "d3-scale" library
     */
    {
        props: ['data_1', 'width', 'height'],
        /*  data_1:
         */

        template: `
            <!-- Outer container box, serving as Vue-required template root  -->
            <svg  class='container'
                v-bind:width='width' v-bind:height='height'
            >

                <rect v-for="item in data_1"
                        v-bind:key="index"
                        v-bind:x="compute_x(item)"
                        v-bind:y="compute_y(item)"
                        width='54'
                        v-bind:height="compute_height(item)"
                        fill='none' stroke='black'  class='bar'
                />

            </svg>		<!-- End of outer container box -->
            `,


        data: function() {
            return {
                xScale: d3.scaleBand()
                            .domain(this.data_1.map( dp => dp.region ))
                            .rangeRound([0, 250])
                            .padding(0.1),

                // To map [0, 15] onto [200, 0]
                yScale: d3.scaleLinear()
                            .domain([0, 15])
                            .range([200, 0])
            }
        }, // data



        // ---------------------------  METHODS  ---------------------------
        methods: {

            compute_x(dt)
            {
                return this.xScale(dt.region);
            },

            compute_y(dt)
            {
                return this.yScale(dt.value);
            },

            compute_height(dt)
            {
                return 200 - this.compute_y(dt);
            }

        }  // METHODS

    }
); // end component