Vue.component('vue-simple-test-c',
    /* A bar chart, utilizing an SVG template,
       with iterations by Vue and parameters with hardwired computations
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

                <rect v-for="(item, index) in data_1"
                        v-bind:key="index"
                        v-bind:x="compute_x(index)"
                        v-bind:y="compute_y(item)"
                        width='54'
                        v-bind:height="compute_height(item)"
                        fill='none' stroke='black'  class='bar'
                />

            </svg>		<!-- End of outer container box -->
            `,


        data: function() {
            return {
                example: false   // NOT used
            }
        }, // data



        // ---------------------------  METHODS  ---------------------------
        methods: {

            compute_x(index)
            {
                return 8 + (index * 60);
            },

            compute_y(item)
            //  To map [0, 15] onto [200, 0]
            {
                return 200 - (item.value * 13.333);
            },

            compute_height(item)
            {
                return item.value * 13.333;
            }

        }  // METHODS

    }
); // end component