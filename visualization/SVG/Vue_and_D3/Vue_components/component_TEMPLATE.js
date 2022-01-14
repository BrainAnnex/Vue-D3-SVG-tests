Vue.component('vue-name',
    {
        props: ['a', 'b'],
        /*  a:
            b:
         */

        template: `
            <section>	    <!-- Outer container box, serving as Vue-required template root  -->


            </section>		<!-- End of outer container box -->
            `,


        data: function() {
            return {
                data1: false,
                data2: 123
            }
        },  // data


        mounted() {
            console.log("The component is now mounted");
        },

        // ---------------------------  COMPUTED  ---------------------------
        computed: {

            foo1()
            {
            }

        },  // COMPUTED


        // ---------------------------  METHODS  ---------------------------
        methods: {

            foo2()
            {

            },

            foo3()
            {

            }

        }  // METHODS

    }
); // end component