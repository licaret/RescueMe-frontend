<template>
  <Messaging :initialRecipientId="recipientId" :initialRecipientUsername="recipientName" />
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Messaging from '@/components/Messaging.vue';

export default {
  name: 'ShelterMessages',
  components: {
    Messaging
  },
  
  setup() {
    const route = useRoute();
    const recipientId = ref(null);
    const recipientName = ref(null);
    
    onMounted(() => {
      if (route.query.adopterId) {
        recipientId.value = route.query.adopterId;
        recipientName.value = route.query.adopterName || 'Adopter';
      } else if (route.query.shelterId) {
        recipientId.value = route.query.shelterId;
        recipientName.value = route.query.shelterName || 'Shelter';
      }
    });
    
    return {
      recipientId,
      recipientName
    };
  }
}
</script>