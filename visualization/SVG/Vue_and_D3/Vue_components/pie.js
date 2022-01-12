Vue.component('vue-pie',
    /*  Create a pie chart, making use of the `vue-arc` component.
        Loosely based on https://www.youtube.com/watch?v=CkFktv0p3pw
     */
    {
        props: ['pie_slice_values', 'inner_radius', 'outer_radius', 'corner_radius'],
        /*
         */

        template: `
            <!-- Outer container box, serving as Vue-required template root  -->
            <svg width="500" height="500">

                <vue-arc v-for="item in arcs"
                    v-bind:key="item.index"
                    v-bind:start_angle="item.startAngle"
                    v-bind:end_angle="item.endAngle"
                    v-bind:color="color_picker(item.index)"

                    v-bind:inner_radius="inner_radius"
                    v-bind:outer_radius="outer_radius"
                    v-bind:corner_radius="corner_radius"
                >
                </vue-arc>

            </svg>

            <!-- End of outer box -->
            `,


        data: function() {
            return {
                start_angle: 0,
                end_angle: Math.PI * 2,
                pad_angle: 0
            }
        },  // data


        // ---------------------------  COMPUTED  ---------------------------
        computed: {

            arcs()
            /* Generate and return an array of objects representing arcs,
               each with the following properties:
                    index
                    data
                    value
                    startAngle
                    endAngle
                    padAngle
             */
            {
                const pie_func = d3.pie()
                                    .startAngle(this.start_angle)
                                    .endAngle(this.end_angle)
                                    .padAngle(this.pad_angle);      // This will be a function

                return pie_func(this.pie_slice_values);
            }

        },  // COMPUTED


        // ---------------------------  METHODS  ---------------------------
        methods: {
            color_picker(index)
            {
                if (index == 0)
                    return "yellow";
                if (index == 1)
                    return "blue";
                if (index == 2)
                    return "red";
                if (index == 3)
                    return "green";
                if (index == 4)
                    return "brown";
            }
        }  // METHODS

    }
); // end component