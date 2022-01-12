Vue.component('vue-dots-lines',
    /*
        Based on https://www.youtube.com/watch?v=CkFktv0p3pw
     */
    {
        props: [],
        /*
         */

        template: `
            <!-- Outer container box, serving as Vue-required template root  -->
            <section>

                <svg width="500" height="500">

                    <circle r="10"
                        v-for="(item, index) in dataset"
                            v-bind:key="index"
                            v-bind:cx="item[0]"
                            v-bind:cy="item[1]"
                            fill="#555"
                            @click="on_click(item)"
                    />

                    <path stroke="green" stroke-width="2"
                        fill="none"
                        v-bind:d="path_data_straight"
                    />

                    <path stroke="red" stroke-width="4"
                        fill="none"
                        v-bind:d="path_data_curve"
                    />

                    <path stroke="yellow" stroke-width="3"
                        fill="none"
                        v-bind:d="path_data_steps"
                    />

                </svg>

                <button @click="switch_curve_type" style='font-weight:bold; padding:5px'>
                    Toggle between Step curves<br>(animated on Chrome)
                </button>
                <span style='color:grey; margin-left:10px'>(currently '{{curve_type}}')</span>

            </section>
            <!-- End of outer container box -->
            `,


        data: function() {
            return {
                dataset: [ [80, 200], [100, 123], [250, 200] , [250, 300] , [220, 400], [310, 380] ],
                curve_type: "curveNatural"
            }
        },  // data


        // ---------------------------  COMPUTED  ---------------------------
        computed: {

            path_data_straight()
            {
                const line_func = d3.line()
                                      .x(v => v[0])
                                      .y(v => v[1]);      // This will be a function

                return line_func(this.dataset);
            },

            path_data_curve()
            {
                const curve_func = d3.line()
                                     .curve(d3[this.curve_type])
                                     .x(v => v[0])
                                     .y(v => v[1]);      // This will be a function

               return curve_func(this.dataset);
            },

            path_data_steps()
            {
                const curve_func = d3.line()
                                     .curve(d3.curveStep)
                                     .x(v => v[0])
                                     .y(v => v[1]);      // This will be a function

               return curve_func(this.dataset);
            }

        },  // COMPUTED


        // ---------------------------  METHODS  ---------------------------
        methods: {

            on_click(item) {
                console.log("This item: ", item);
            },

            switch_curve_type()  {
                //this.curve_type = (this.curve_type === "curveBasis" ? "curveNatural" : "curveBasis");
                this.curve_type = (this.curve_type === "curveStepAfter" ? "curveStepBefore" : "curveStepAfter");
            }

        }  // METHODS

    }
); // end component