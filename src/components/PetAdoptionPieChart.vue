<template>
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b">
        <h2 class="text-lg font-semibold text-gray-800">Pet Adoption Statistics</h2>
      </div>
      <div class="p-4">
        <div class="mb-6 max-w-full h-64 mx-auto">
          <canvas ref="chartCanvas"></canvas>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-gray-200 p-3 rounded-lg text-center">
            <div class="font-bold text-xl text-gray-600">{{ stats.adopted }}</div>
            <p class="text-sm text-gray-700">Adopted</p>
          </div>
          <div class="bg-yellow-100 p-3 rounded-lg text-center">
            <div class="font-bold text-xl text-yellow-600">{{ stats.pending }}</div>
            <p class="text-sm text-gray-700">Pending</p>
          </div>
          <div class="bg-green-100 p-3 rounded-lg text-center">
            <div class="font-bold text-xl text-green-600">{{ stats.available }}</div>
            <p class="text-sm text-gray-700">Available</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  
  export default {
    name: 'PetAdoptionPieChart',
    props: {
      stats: {
        type: Object,
        default: () => ({
          adopted: 8,
          pending: 3,
          available: 13
        })
      }
    },
    setup(props) {
      const chartCanvas = ref(null);
      let chart = null;
  
      const createChart = () => {
        if (!chartCanvas.value) return;
        
        const ctx = chartCanvas.value.getContext('2d');
        
        import('chart.js/auto').then((ChartModule) => {
          const Chart = ChartModule.default;
          
          if (chart) chart.destroy();
          
          chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Adopted', 'Pending', 'Available'],
              datasets: [{
                data: [props.stats.adopted, props.stats.pending, props.stats.available],
                backgroundColor: ['#d1d5db', '#fef3c7', '#d1fae5'],
                borderColor: ['#ffffff', '#ffffff', '#ffffff'],
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
                }
              },
              cutout: '50%'
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
        chartCanvas
      };
    }
  };
  </script>
