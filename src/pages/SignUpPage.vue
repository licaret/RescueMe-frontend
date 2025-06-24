<script>
import IntroNavbar from "@/components/IntroNavbar.vue";

import SignUp from "@/components/SignUp.vue";
import IntroFooter from "@/components/IntroFooter.vue";

export default {
  name: "SignUpPage",
  components: {
    IntroNavbar,
    SignUp,
    // IntroFooter,
  },
};
</script>

<template>
  <div class="signup-page">
    <IntroNavbar />
    <SignUp />
    <!-- <IntroFooter /> -->
  </div>
</template>

