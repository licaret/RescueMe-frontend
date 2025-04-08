<template>
  <div class="bg-white rounded-2xl shadow transition-all duration-300 hover:shadow-lg">
    <div class="p-4 border-b flex justify-between items-center">
      <h2 class="text-lg font-semibold text-gray-800">Pet Adoption Statistics</h2>
      <div class="text-sm text-gray-500">
        Total: {{ totalPets }}
      </div>
    </div>
    <div class="p-4">
      <!-- No Data State -->
      <div v-if="totalPets === 0" class="flex flex-col items-center justify-center py-8">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-gray-600 mb-2">No pets have been added yet</p>
        <p class="text-sm text-gray-500 text-center max-w-xs">Once pets are added to the platform, you'll see adoption statistics here.</p>
        <button 
          v-if="showAddButton" 
          @click="$emit('add-pet')" 
          class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Add Your First Pet
        </button>
      </div>
      
      <!-- Chart View (when data exists) -->
      <div v-else>
        <div class="mb-6 max-w-full h-64 mx-auto">
          <canvas ref="chartCanvas"></canvas>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-gray-200 p-3 rounded-2xl text-center transform transition-transform hover:scale-105">
            <div class="font-bold text-xl text-gray-600">{{ stats.adopted }}</div>
            <p class="text-sm text-gray-700">Adopted</p>
          </div>
          <div class="bg-yellow-100 p-3 rounded-2xl text-center transform transition-transform hover:scale-105">
            <div class="font-bold text-xl text-yellow-600">{{ stats.pending }}</div>
            <p class="text-sm text-gray-700">Pending</p>
          </div>
          <div class="bg-green-100 p-3 rounded-2xl text-center transform transition-transform hover:scale-105">
            <div class="font-bold text-xl text-green-600">{{ stats.available }}</div>
            <p class="text-sm text-gray-700">Available</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
  
export default {
  name: 'PetAdoptionPieChart',
  props: {
    stats: {
      type: Object,
      default: () => ({
        adopted: 0,
        pending: 0,
        available: 0
      })
    },
    showAddButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['add-pet'],
  setup(props) {
    const chartCanvas = ref(null);
    let chart = null;
    
    const totalPets = computed(() => {
      return props.stats.adopted + props.stats.pending + props.stats.available;
    });

    const createChart = () => {
      if (!chartCanvas.value || totalPets.value === 0) return;
      
      const ctx = chartCanvas.value.getContext('2d');
      
      import('chart.js/auto').then((ChartModule) => {
        const Chart = ChartModule.default;
        
        if (chart) chart.destroy();
        
        // Enhanced color scheme
        const colors = {
          adopted: {
            background: '#d1d5db',
            border: '#9ca3af',
            hover: '#9ca3af'
          },
          pending: {
            background: '#fef3c7',
            border: '#fcd34d',
            hover: '#fcd34d'
          },
          available: {
            background: '#d1fae5',
            border: '#6ee7b7',
            hover: '#6ee7b7'
          }
        };
        
        chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Adopted', 'Pending', 'Available'],
            datasets: [{
              data: [props.stats.adopted, props.stats.pending, props.stats.available],
              backgroundColor: [colors.adopted.background, colors.pending.background, colors.available.background],
              borderColor: [colors.adopted.border, colors.pending.border, colors.available.border],
              hoverBackgroundColor: [colors.adopted.hover, colors.pending.hover, colors.available.hover],
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              },
              // Add a title in the center of the doughnut
              title: {
                display: true,
                text: totalPets.value.toString(),
                position: 'center',
                font: {
                  size: 20,
                  weight: 'bold'
                },
                padding: {
                  top: 10,
                  bottom: 0
                }
              },
              subtitle: {
                display: true,
                text: 'TOTAL',
                position: 'center',
                font: {
                  size: 12,
                  weight: 'normal'
                },
                padding: {
                  top: 0,
                  bottom: 10
                }
              }
            },
            cutout: '65%',
            animation: {
              animateScale: true,
              animateRotate: true
            }
          }
        });
      });
    };

    watch(() => props.stats, () => {
      createChart();
    }, { deep: true });

    onMounted(() => {
      createChart();
      window.addEventListener('resize', createChart);
    });

    onUnmounted(() => {
      if (chart) chart.destroy();
      window.removeEventListener('resize', createChart);
    });

    return {
      chartCanvas,
      totalPets
    };
  }
};
</script>

<style scoped>
/* Animation for scale effect on hover */
.transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>