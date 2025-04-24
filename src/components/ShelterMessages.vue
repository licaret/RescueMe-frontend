<template>
   
   <Messaging />
    
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import Messaging from '@/components/Messaging.vue';
  
  export default {
    name: 'ShelterMessages',
    components: {
      Messaging
    },
    setup() {
      return {};
    }
  }
  </script>