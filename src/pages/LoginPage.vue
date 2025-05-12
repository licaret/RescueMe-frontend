<template>
  <div class="login-page">
    <IntroNavbar />
    <div class="pt-32 sm:pt-40"> 
      <Login />
    </div>
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

<style>
.login-page {
  min-height: 100vh;
}
</style>