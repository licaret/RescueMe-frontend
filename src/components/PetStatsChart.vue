<template>
  <div class="w-96 mx-auto mt-16 ml-10 bg-white p-6 rounded-2xl shadow-2xl">
    <h3 class="text-lg font-semibold text-gray-700 mb-4 text-center">Pet Adoption Statistics</h3>

    <div v-if="totalPets > 0">
      <PieChart :chart-data="chartData" :chart-options="chartOptions" class="w-full h-80" />
    </div>
    
    <div v-else class="flex items-center justify-center h-80">
      <div class="w-40 h-40 flex items-center justify-center rounded-full border-4 border-gray-300 bg-gray-100 shadow-md">
        <p class="text-center text-gray-500 font-semibold text-lg">No Pets Yet</p>
      </div>
    </div>

    <p class="text-center text-gray-700 mt-4 font-semibold">
      Total Pets: <span class="text-red-600">{{ totalPets }}</span>
    </p>
  </div>
</template>


<script>
import { ref, computed, onMounted } from "vue";
import { PieChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  components: { PieChart },
  setup() {
    const chartData = ref({
      labels: ["Adopted", "Pending", "Available"],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ["#E53935", "#B0BEC5", "#424242"],
          borderColor: ["#B71C1C", "#CFD8DC", "#212121"],
          borderWidth: 2,
        },
      ],
    });

    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            color: "#555",
            font: { size: 14, weight: "bold" },
          },
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              return `${tooltipItem.label}: ${tooltipItem.raw} pets`;
            },
          },
        },
      },
    });

    const totalPets = computed(() =>
      chartData.value.datasets[0].data.reduce((a, b) => a + b, 0)
    );

    const fetchStats = async () => {
      try {
        const Id = localStorage.getItem("Id"); // 🔹 Obținem `Id`
        if (!Id) {
          console.error("Shelter ID not found.");
          return;
        }

        const response = await fetch(`http://localhost:8080/pets/stats/${Id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch pet stats");
        }

        const data = await response.json();
        chartData.value.datasets[0].data = [data.adopted, data.pending, data.available];
      } catch (error) {
        console.error("Error fetching pet stats:", error);
      }
    };

    onMounted(fetchStats);

    return { chartData, chartOptions, totalPets };
  },
};
</script>
