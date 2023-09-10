<template>
    <div>
        <horizontal-navbar></horizontal-navbar>

        <section id="knowledge-base-search">
            <b-card no-body
                    class="knowledge-base-bg text-center">
                <b-card-body class="card-body">
                    <h2 class="text-primary">
                        Welcome to eBazaar admin panel
                    </h2>

                    <!-- form -->
                </b-card-body>
            </b-card>
        </section>
    </div>
</template>

<script>
/* eslint-disable */

    import HorizontalNavbar from "../navbar/HorizontalNavbar";
    import {
        BCard, BCardBody
    } from 'bootstrap-vue'
    export default {
        name: "Main",
        components: {
            BCard,
            BCardBody,
            HorizontalNavbar}
    }
</script>

<style lang="scss">

    #knowledge-base-search h2 {
        height: 30vh;
        line-height: 30vh;
    }

    .knowledge-base-bg {
        background-image: url('../../assets/images/banner/banner.png');
    }

</style>
