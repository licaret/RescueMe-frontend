<template>
    <section class="relative min-h-screen bg-gradient-to-b from-white via-gray-300 to-black">
      <div class="container mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between pt-20 lg:pt-0">
        <!-- Image Container -->
        <div class="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
          <img 
            src="../assets/dog_hanging3.png" 
            alt="Dog wrapped in white fabric" 
            class="w-3/4 lg:w-4/5 object-contain"
          >
        </div>
        
        <!-- Text Container -->
        <div class="w-full lg:w-1/2 text-right pt-8 lg:pt-0">
          <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            <span class="text-black opacity-70">WE<br/>ARE<br/>THE<br/>VOICE</span>
            <br/>
            <span class="text-red-600 opacity-90">FOR<br/>THE VOICELESS</span>
          </h1>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'HeroSection'
  }
  </script>