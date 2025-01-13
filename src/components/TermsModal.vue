<template>
    <div>
      <!-- Modal trigger is handled by the parent, this component is for the modal only -->
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-black opacity-50" @click="$emit('update:modelValue', false)"></div>
        
        <!-- Modal content -->
        <div class="relative w-full max-w-3xl mx-auto my-6 z-50">
          <div class="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none dark:bg-gray-800">
            <!-- Header -->
            <div class="flex items-start justify-between p-5 border-b border-gray-200 rounded-t dark:border-gray-700">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                Terms and Conditions
              </h3>
              <button
                class="p-1 ml-auto border-0 text-gray-600 float-right text-3xl leading-none font-semibold hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                @click="$emit('update:modelValue', false)"
              >
                ×
              </button>
            </div>
  
            <!-- Body -->
            <div class="relative p-6 flex-auto overflow-y-auto max-h-[70vh]">
              <div class="text-gray-700 dark:text-gray-300 space-y-6">
                <!-- Introduction -->
                <section class="space-y-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">1. Introduction</h3>
                  <p>Welcome to our pet adoption platform. These terms and conditions govern your use of our platform and the services we provide. By accessing or using our platform, you agree to be bound by these terms.</p>
                </section>
  
                <!-- Account Types -->
                <section class="space-y-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">2. Account Types and Responsibilities</h3>
                  
                  <div class="mt-3">
                    <h4 class="font-medium">2.1 Adopter Accounts</h4>
                    <ul class="list-disc pl-6 mt-2 space-y-1">
                      <li>Must be 18 years or older to create an account</li>
                      <li>Required to provide accurate and current personal information</li>
                      <li>Responsible for maintaining account security</li>
                      <li>Must engage respectfully with shelters and other users</li>
                      <li>Agree to background checks if required by shelters</li>
                    </ul>
                  </div>
  
                  <div class="mt-3">
                    <h4 class="font-medium">2.2 Shelter Accounts</h4>
                    <ul class="list-disc pl-6 mt-2 space-y-1">
                      <li>Must be a legally registered animal shelter or rescue organization</li>
                      <li>Required to maintain valid licenses and permits</li>
                      <li>Must provide accurate information about available pets</li>
                      <li>Responsible for updating pet listings regularly</li>
                      <li>Must follow local animal welfare regulations</li>
                    </ul>
                  </div>
                </section>
  
                <!-- Adoption Process -->
                <section class="space-y-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">3. Adoption Process</h3>
                  <p>The platform facilitates connections between adopters and shelters. Users understand and agree that:</p>
                  <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>The platform is a facilitator and not directly involved in adoptions</li>
                    <li>Each shelter may have different adoption requirements</li>
                    <li>All adoptions must comply with local laws and regulations</li>
                    <li>Background checks may be required by shelters</li>
                    <li>Adoption fees are set by individual shelters</li>
                  </ul>
                </section>
  
                <!-- Privacy -->
                <section class="space-y-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">4. Privacy and Data Protection</h3>
                  <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>Personal information is collected and processed as described in our Privacy Policy</li>
                    <li>Users maintain rights over their personal data</li>
                    <li>Data is protected using industry-standard security measures</li>
                    <li>Users can request data deletion as per privacy laws</li>
                  </ul>
                </section>
  
                <!-- Platform Rules -->
                <section class="space-y-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">5. Platform Rules and Guidelines</h3>
                  <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>No fraudulent or misleading information</li>
                    <li>No harassment or discriminatory behavior</li>
                    <li>No commercial breeding operations</li>
                    <li>No selling or trading of animals</li>
                    <li>Platform reserves right to suspend violating accounts</li>
                  </ul>
                </section>
  
                <!-- Liability -->
                <section class="space-y-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">6. Limitation of Liability</h3>
                  <p>The platform:</p>
                  <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>Does not guarantee the accuracy of user-provided information</li>
                    <li>Is not responsible for adoption outcomes</li>
                    <li>Does not mediate disputes between users</li>
                    <li>Maintains the right to modify services</li>
                  </ul>
                </section>
              </div>
            </div>
  
            <!-- Footer -->
            <div class="flex items-center justify-end p-6 border-t border-gray-200 rounded-b dark:border-gray-700">
              <button
                class="px-6 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none"
                @click="$emit('update:modelValue', false)"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TermsModal',
    props: {
      modelValue: {
        type: Boolean,
        required: true
      }
    },
    emits: ['update:modelValue']
  };
  </script>