<script>
import IntroNavbar from "@/components/IntroNavbar.vue";
import Login from "@/components/Login.vue";
import IntroFooter from "@/components/IntroFooter.vue";

export default {
  name: "LoginPage",
  components: {
    IntroNavbar,
    Login,
    IntroFooter,
  },
};
</script>

<template>
  <div class="login-page">
    <IntroNavbar />
    <Login />
    <IntroFooter />
  </div>
</template>

