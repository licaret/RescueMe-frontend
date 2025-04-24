<template>
    <div>
      <Navbar />
      <div class="mt-16 h-[calc(100vh-64px)]">
        <Messaging 
          :initialRecipientId="shelterId" 
          :initialRecipientUsername="shelterName" 
        />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import Navbar from '@/components/Navbar.vue';
  import Messaging from '@/components/Messaging.vue';
  
  export default {
    name: 'MessagesPage',
    components: {
      Navbar,
      Messaging
    },
    setup() {
      const route = useRoute();
      
      // Extract shelter ID from query params, if any
      const shelterId = ref(null);
      const shelterName = ref(null);
      
      onMounted(() => {
        if (route.query.shelterId) {
          shelterId.value = route.query.shelterId;
          shelterName.value = route.query.shelterName || 'Shelter';
        }
      });
      
      return {
        shelterId,
        shelterName
      };
    }
  }
  </script>