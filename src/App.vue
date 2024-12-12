<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
body {
  margin: 0;
  font-family: 'Roboto', sans-serif; 
  background-color: white;
}

html, body {
  margin: 0;
  padding: 0; 
  overflow-x: hidden;
  height: 100%;
  width: 100%;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}


</style>
