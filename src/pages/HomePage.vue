<template>
  <Navbar></Navbar>
  <section class="relative min-h-screen bg-gradient-to-b from-white via-white to-black">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between py-12 sm:py-16 lg:py-0">
      <!-- Image Container -->
      <div class="w-full lg:w-1/2 flex justify-center lg:justify-end relative mb-8 lg:mb-0 -ml-12">
        <img
          src="../assets/dog_hanging_in_blanket.png"
          alt="Dog wrapped in white fabric"
          class="w-full sm:w-3/4 lg:w-4/5 object-contain"
        >
      </div>

      <!-- Text Container -->
      <div class="w-full lg:w-1/2 text-center lg:text-right transform -translate-x-12">
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
          <span class="text-black opacity-70">WE<br/>ARE<br/>THE<br/>VOICE</span>
          <br/>
          <span class="text-red-700 opacity-90">FOR<br/>THE VOICELESS</span>
        </h1>
      </div>
    </div>
  </section>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
export default {
  name: 'HomePage',
  components: {
    Navbar, 
  },
}
</script>

<style>
h1, img {
  user-select: none;
}
</style>