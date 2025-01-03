<script>
import IntroNavbar from "@/components/IntroNavbar.vue";
import Hero from "@/components/Hero.vue";
import IntroFooter from "@/components/IntroFooter.vue";

export default {
  name: "LandingPage",
  components: {
    IntroNavbar,
    Hero,
    IntroFooter,
  },
};
</script>

<template>
  <div class="landing-page">
    <IntroNavbar />
    <Hero />
    <IntroFooter />
  </div>
</template>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

.hero {
  flex: 1; 
}

/* footer {
  height: 64px;
} */
</style>
