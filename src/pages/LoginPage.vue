<template>
  <div class="login-page">
    <IntroNavbar />
    <Login />
  </div>
</template>


<script>
import IntroNavbar from "@/components/IntroNavbar.vue";
import Login from "@/components/Login.vue";

export default {
  name: "LoginPage",
  components: {
    IntroNavbar,
    Login,
  },
};
</script>


