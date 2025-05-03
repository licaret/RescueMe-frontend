<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <!-- Added padding from the top to create space after navbar -->
    <div class="flex-1 container mx-auto px-4 py-6 mt-20 max-w-7xl">
      <div class="bg-white rounded-2xl shadow-lg">
        <Messaging 
          :initialRecipientId="shelterId" 
          :initialRecipientUsername="shelterName" 
        />
      </div>
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

<style scoped>
/* Add any additional custom styling here if needed */
</style>