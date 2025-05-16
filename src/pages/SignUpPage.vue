<template>
  <div class="signup-page">
    <IntroNavbar />
    <div class="pt-16"> 
      <SignUp />
    </div>
  </div>
</template>

<script>
import IntroNavbar from "@/components/IntroNavbar.vue";
import SignUp from "@/components/SignUp.vue";

export default {
  name: "SignUpPage",
  
  components: {
    IntroNavbar,
    SignUp,
  },
};
</script>

<style>
.signup-page {
  min-height: 100vh;
}
</style>