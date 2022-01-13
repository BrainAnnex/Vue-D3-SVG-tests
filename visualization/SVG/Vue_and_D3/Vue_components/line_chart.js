Vue.component('vue-line-chart',
    /*
        A line chart.
        Based on https://medium.com/tyrone-tudehope/composing-d3-visualizations-with-vue-js-c65084ccb686
     */
    {
        props: [],
        /*
         */

        template: `
            <!-- Outer container, serving as Vue-required template root  -->
            <svg width="500" height="270">

                <g style="transform: translate(0, 10px)">
                    <path :d="line" />
                </g>

            </svg>
            <!-- End of outer container -->
            `,


        data: function() {
            return {
                data: [99, 71, 78, 25, 36, 92],
                line: ''
            }
        },  // data


        // ---------------------------  COMPUTED  ---------------------------
        computed: {


        },  // COMPUTED


        mounted() {
            this.calculatePath();
        },

        // ---------------------------  METHODS  ---------------------------
        methods: {

            getScales() {
                console.log("In getScales");
                const x = d3.scaleLinear().range([0, 430]);
                const y = d3.scaleLinear().range([210, 0]);

                d3.axisLeft().scale(x);
                console.log("Finished with x axis");
                //d3.axisBottom().scale(y);
                d3.axisBottom(x);
                console.log("Finished with axes");

                x.domain(d3.extent(this.data, (d, i) => i));
                y.domain([0, d3.max(this.data, d => d)]);
                return { x, y };
            },

            calculatePath() {
                console.log("In calculatePath");
                const scale = this.getScales();
                console.log("returned from getScales");
                const path = d3.line()
                    .x((d, i) => scale.x(i))
                    .y(d => scale.y(d));
                this.line = path(this.data);
            }

        }  // METHODS

    }
); // end component