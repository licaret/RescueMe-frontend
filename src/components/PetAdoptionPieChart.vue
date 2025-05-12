<template>
  <div class="bg-white rounded-lg shadow-sm mt-6">
    <div class="p-5 flex justify-between items-center border-b">
      <h2 class="text-gray-800 text-lg font-medium">Adoption Dashboard</h2>
      <div class="bg-blue-50 text-blue-800 text-sm py-1 px-3 rounded-full font-medium">
        {{ totalPets }} pets
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-if="totalPets === 0" class="flex flex-col items-center justify-center p-10">
      <div class="text-gray-400 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </div>
      <p class="text-gray-600 mb-4">No pets have been added yet</p>
      <button 
        v-if="showAddButton" 
        @click="$emit('add-pet')" 
        class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
      >
        Add Pet
      </button>
    </div>
    
    <!-- Stats with chart -->
    <div v-else class="p-5">
      <div class="flex flex-col md:flex-row mb-8">
        <div class="w-full md:w-1/2 relative" style="height: 220px;">
          <canvas ref="chartCanvas"></canvas>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <div class="text-2xl font-semibold text-gray-800">{{ totalPets }}</div>
            <div class="text-xs text-gray-500">TOTAL</div>
          </div>
        </div>
        <div class="w-full md:w-1/2 md:pl-6 flex flex-col justify-center mt-6 md:mt-0">
          <div class="grid gap-4">
            <!-- Available -->
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
              <div class="flex-1">
                <div class="flex justify-between items-baseline">
                  <div class="text-sm text-gray-600">Available</div>
                  <div class="text-xl font-medium text-gray-800">{{ stats.available }}</div>
                </div>
                <div class="mt-1 bg-gray-200 h-1.5 rounded-full w-full overflow-hidden">
                  <div class="h-full bg-blue-500 rounded-full" :style="{width: `${getPercentage('available')}%`}"></div>
                </div>
              </div>
            </div>
            
            <!-- Pending -->
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-amber-500 mr-3"></div>
              <div class="flex-1">
                <div class="flex justify-between items-baseline">
                  <div class="text-sm text-gray-600">Pending</div>
                  <div class="text-xl font-medium text-gray-800">{{ stats.pending }}</div>
                </div>
                <div class="mt-1 bg-gray-200 h-1.5 rounded-full w-full overflow-hidden">
                  <div class="h-full bg-amber-500 rounded-full" :style="{width: `${getPercentage('pending')}%`}"></div>
                </div>
              </div>
            </div>
            
            <!-- Adopted -->
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
              <div class="flex-1">
                <div class="flex justify-between items-baseline">
                  <div class="text-sm text-gray-600">Adopted</div>
                  <div class="text-xl font-medium text-gray-800">{{ stats.adopted }}</div>
                </div>
                <div class="mt-1 bg-gray-200 h-1.5 rounded-full w-full overflow-hidden">
                  <div class="h-full bg-green-500 rounded-full" :style="{width: `${getPercentage('adopted')}%`}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'PetAdoptionPieChart',
  props: {
    stats: {
      type: Object,
      required: true,
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
    
    const getPercentage = (type) => {
      if (totalPets.value === 0) return 0;
      return Math.round((props.stats[type] / totalPets.value) * 100);
    };

    const initializeChart = async () => {
      if (chart) {
        chart.destroy();
        chart = null;
      }

      await nextTick();
      
      if (!chartCanvas.value || totalPets.value === 0) return;
      
      const ctx = chartCanvas.value.getContext('2d');
      
      const colors = {
        available: {
          background: 'rgba(59, 130, 246, 0.9)',
          border: '#fff'
        },
        pending: {
          background: 'rgba(245, 158, 11, 0.9)',
          border: '#fff'
        },
        adopted: {
          background: 'rgba(16, 185, 129, 0.9)',
          border: '#fff'
        }
      };
      
      chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Available', 'Pending', 'Adopted'],
          datasets: [{
            data: [props.stats.available, props.stats.pending, props.stats.adopted],
            backgroundColor: [
              colors.available.background, 
              colors.pending.background, 
              colors.adopted.background
            ],
            borderColor: [colors.available.border, colors.pending.border, colors.adopted.border],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#111827',
              bodyColor: '#374151',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              cornerRadius: 4,
              displayColors: true,
              boxPadding: 4,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const percentage = getPercentage(label.toLowerCase());
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    };


    watch(() => props.stats, () => {
      setTimeout(() => {
        initializeChart();
      }, 100);
    }, { deep: true });


    const observer = ref(null);
    
    onMounted(() => {
      initializeChart();
      
      window.addEventListener('resize', initializeChart);
      
      observer.value = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          initializeChart();
        }
      });
      
      if (chartCanvas.value) {
        observer.value.observe(chartCanvas.value);
      }
    });


    onBeforeUnmount(() => {
      if (chart) {
        chart.destroy();
      }
      
      window.removeEventListener('resize', initializeChart);
      
      if (observer.value && chartCanvas.value) {
        observer.value.unobserve(chartCanvas.value);
      }
    });

    
    return {
      chartCanvas,
      totalPets,
      getPercentage
    };
  }
};
</script>