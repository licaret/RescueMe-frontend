<template>
  <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-8 z-50">
    <div class="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">

      <!-- Form Header -->
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">{{ petToEdit ? 'Edit Pet' : 'Add New Pet' }}</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">×</span>
          </button>
        </div>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Basic Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Basic Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input
                v-model="petData.name"
                type="text"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Species</label>
              <select
                v-model="petData.species"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Breed</label>
              <input
                v-model="petData.breed"
                type="text"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Age (years)</label>
              <input
                v-model="petData.age"
                type="number"
                min="0"
                step="0.1"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Sex</label>
              <select
                v-model="petData.sex"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Size</label>
              <select
                v-model="petData.size"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select
                v-model="petData.status"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="AVAILABLE">Available</option>
                <option value="PENDING">Pending</option>
                <option value="ADOPTED">Adopted</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Time Spent in Shelter</label>
              <input
                v-model="petData.timeSpentInShelter"
                type="text"
                placeholder="e.g., 6 months, 1 year"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        <!-- Health Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Health Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Health Status</label>
              <select
                v-model="petData.healthStatus"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="Healthy">Healthy</option>
                <option value="Minor Issues">Minor Issues</option>
                <option value="Needs Medical Attention">Needs Medical Attention</option>
                <option value="Recovered">Recovered</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Critical Condition">Critical Condition</option>
                <option value="Needs Surgery">Needs Surgery</option>
                <option value="Disabled">Disabled</option>
                <option value="Senior Care">Senior Care</option>
                <option value="Special Needs">Special Needs</option>
              </select>
            </div>
            <div class="flex gap-4">
              <div class="flex items-center">
                <input
                  v-model="petData.vaccinated"
                  type="checkbox"
                  class="rounded border-gray-300"
                />
                <label class="ml-2 text-sm text-gray-700">Vaccinated</label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="petData.neutered"
                  type="checkbox"
                  class="rounded border-gray-300"
                />
                <label class="ml-2 text-sm text-gray-700">Neutered</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Photo Upload -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Photos</h3>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div class="flex items-center justify-center">
              <label class="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload"
                />
                <div class="text-center">
                  <div class="mt-2 flex text-sm text-gray-600">
                    <span class="relative cursor-pointer rounded-md font-medium text-red-600 hover:text-red-500">
                      Upload photos
                    </span>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                </div>
              </label>
            </div>
            <div v-if="photoPreview.length" class="mt-4 grid grid-cols-3 gap-2">
              <div v-for="(photo, index) in photoPreview" :key="photo.id || index" class="relative w-24 h-24">
                <img :src="photo.url" class="h-full w-full object-cover rounded-lg" />
                <button
                  @click.prevent="handleRemovePhoto(index)"
                  class="absolute -top-1 -right-8 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pet Story -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Pet's Story</h3>
          <textarea
            v-model="petData.story"
            rows="4"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Share this pet's story..."
          ></textarea>
        </div>

        <!-- Adoption Status -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Adoption Status</h3>
          <div class="flex gap-4">
            <div class="flex items-center">
              <input
                v-model="petData.urgentAdoptionNeeded"
                type="checkbox"
                class="rounded border-gray-300"
              />
              <label class="ml-2 text-sm text-gray-700">Urgent Adoption Needed</label>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {{ petToEdit ? 'Update Pet' : 'Add Pet' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>



<script>
import { ref, watch } from 'vue';

export default {
  name: 'AddPetForm',
  props: {
    petToEdit: Object,
  },
  emits: ['close', 'pet-added', 'pet-updated'],
  setup(props, { emit }) {
    const petData = ref({
      name: '',
      species: '',
      breed: '',
      age: '',
      sex: 'Male', 
      size: 'Medium', 
      status: 'AVAILABLE',
      timeSpentInShelter: '',
      healthStatus: 'Healthy',
      vaccinated: false,
      neutered: false,
      story: '',
      urgentAdoptionNeeded: false,
    });

    const photoPreview = ref([]);
    const photoFiles = ref([]);
    // const deleteExistingPhotos = ref(false);
    const existingPhotos = ref([]);
    const photoIdsToDelete = ref([]);


    // Reparat watch function
    watch(() => props.petToEdit, (newPet) => {
      if (newPet) {
        petData.value = { ...newPet };

        photoFiles.value = [];
        photoIdsToDelete.value = [];

        if (newPet.photos && newPet.photos.length > 0) {
          existingPhotos.value = newPet.photos.map(photo => ({
            id: photo.id,
            url: photo.url.startsWith("data:image") ? photo.url : `data:image/jpeg;base64,${photo.url}`
          }));
          photoPreview.value = [...existingPhotos.value];
        } else {
          existingPhotos.value = [];
          photoPreview.value = [];
        }

        console.log("State after initialization:", {
          photoPreview: photoPreview.value,
          existingPhotos: existingPhotos.value
        });
      }
    }, { immediate: true });


    const handlePhotoUpload = (event) => {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          photoPreview.value.push(e.target.result);
          photoFiles.value.push(file);
        };
        reader.readAsDataURL(file);
      });
    };

    const handleRemovePhoto = (index) => {
    console.log("Removing photo at index:", index);

    if (index < existingPhotos.value.length) {
        const photoId = existingPhotos.value[index]?.id;
        if (photoId) {
            photoIdsToDelete.value.push(photoId);
        }
        existingPhotos.value.splice(index, 1);
    } else {
        const newPhotoIndex = index - existingPhotos.value.length;
        photoFiles.value.splice(newPhotoIndex, 1);
    }

    photoPreview.value.splice(index, 1);

    console.log("After removal:", {
        photoPreview: photoPreview.value,
        existingPhotos: existingPhotos.value,
        photoIdsToDelete: photoIdsToDelete.value
    });
};




    const handleSubmit = async () => {
      try {
        const formData = new FormData();
        const isUpdate = !!props.petToEdit;

        // Pregătim datele pentru trimitere
        const petDataToSend = { ...petData.value };
        delete petDataToSend.shelterId;
        delete petDataToSend.shelterUsername;
        delete petDataToSend.photoUrls;

        console.log("Submitting form with:", {
          petData: petDataToSend,
          newPhotos: photoFiles.value.length,
          photoIdsToDelete: photoIdsToDelete.value
        });

        formData.append("petData", JSON.stringify(petDataToSend));

        // Adăugăm pozele noi
        photoFiles.value.forEach((file) => {
          formData.append("photos", file);
        });

        // Adăugăm ID-urile pozelor de șters
        if (photoIdsToDelete.value.length > 0) {
          formData.append("photoIdsToDelete", JSON.stringify(photoIdsToDelete.value));
        }

        const url = isUpdate
          ? `http://localhost:8080/pets/update/${petData.value.id}`
          : "http://localhost:8080/pets/add";

        const response = await fetch(url, {
          method: isUpdate ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "shelterId": localStorage.getItem("shelterId"),
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to save pet: ${await response.text()}`);
        }

        const updatedPet = await response.json();
        console.log("Server response:", updatedPet);

        emit(isUpdate ? "pet-updated" : "pet-added", updatedPet);
        emit("close");
      } catch (error) {
        console.error("Error saving pet:", error);
      }
    };



    return {
      petData,
      photoPreview,
      handlePhotoUpload,
      handleRemovePhoto,
      handleSubmit,
    };
  },
};
</script>
