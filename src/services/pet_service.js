const API_URL = 'http://localhost:8080/pets';
const PHOTO_API_URL = 'http://localhost:8080/pet-photos';

/**
 * Function to create authorized headers with JWT token
 * @param {Object} additionalHeaders - Any additional headers to include
 * @returns {Object} Headers object with Authorization and Content-Type
 */
const getAuthHeaders = (additionalHeaders = {}) => {
  const token = localStorage.getItem('token');
  const shelterId = localStorage.getItem('Id');
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...additionalHeaders
  };
};

/**
 * Process pet data to ensure consistent photo URL format
 * @param {Object|Array} petData - Pet data to process
 * @returns {Object|Array} Processed pet data with consistent photo URLs
 */
const processPetPhotos = (petData) => {
  // Handle array of pets
  if (Array.isArray(petData)) {
    return petData.map(pet => ({
      ...pet,
      photos: pet.photos ? pet.photos.map(photo => ({
        id: photo.id,
        url: photo.url.startsWith("data:image") ? photo.url : `data:image/jpeg;base64,${photo.url}`
      })) : []
    }));
  } 
  // Handle single pet
  else {
    return {
      ...petData,
      photos: petData.photos ? petData.photos.map(photo => ({
        id: photo.id,
        url: photo.url.startsWith("data:image") ? photo.url : `data:image/jpeg;base64,${photo.url}`
      })) : []
    };
  }
};

/**
 * Add a new pet
 * @param {Object} petData - Data for the new pet
 * @param {Array<File>} photos - Pet photos to upload
 * @param {Array<number>} photoIdsToDelete - Optional IDs of photos to delete
 * @returns {Promise<Object>} The newly created pet
 */
async function addPet(petData, photos, photoIdsToDelete = []) {
  try {
    const formData = new FormData();
    
    formData.append("petData", JSON.stringify(petData));
    
    if (photos && photos.length > 0) {
      photos.forEach((file) => {
        formData.append("photos", file);
      });
    }
    
    if (photoIdsToDelete.length > 0) {
      formData.append("photoIdsToDelete", JSON.stringify(photoIdsToDelete));
    }
    
    const token = localStorage.getItem("token");
    const shelterId = localStorage.getItem("Id");
    
    const response = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Id": shelterId
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add pet: ${await response.text()}`);
    }
    
    const newPet = await response.json();
    return processPetPhotos(newPet);
  } catch (error) {
    console.error("Error adding pet:", error);
    throw error;
  }
}

/**
 * Delete a pet
 * @param {number} shelterId - ID of the shelter
 * @param {number} petId - ID of the pet to delete
 * @returns {Promise<boolean>} True if deletion was successful
 */
async function deletePet(shelterId, petId) {
  try {
    const response = await fetch(`${API_URL}/${shelterId}/delete/${petId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to delete pet: ${response.status} ${response.statusText}`);
    }

    return true; 
  } catch (error) {
    console.error("Error deleting pet:", error);
    return false; 
  }
}

/**
 * Update an existing pet
 * @param {number} shelterId - ID of the shelter
 * @param {number} petId - ID of the pet to update
 * @param {Object} petData - Updated pet data
 * @param {Array<File>} photos - New photos to add
 * @param {Array<number>} photoIdsToDelete - IDs of photos to delete
 * @returns {Promise<Object>} The updated pet
 */
async function updatePet(shelterId, petId, petData, photos, photoIdsToDelete = []) {
  try {
    console.log(`Updating pet with ID ${petId} from shelter ID ${shelterId}...`);

    const formData = new FormData();
    formData.append("petData", JSON.stringify(petData));

    if (photos && photos.length > 0) {
      photos.forEach((photo) => {
        formData.append("photos", photo);
      });
    }

    if (photoIdsToDelete.length > 0) {
      formData.append("photoIdsToDelete", JSON.stringify(photoIdsToDelete));
    }

    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/update/${petId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Id": shelterId
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to update pet. Status: ${response.status} ${response.statusText}`);
    }

    const updatedPet = await response.json();
    return processPetPhotos(updatedPet);
  } catch (error) {
    console.error("Error updating pet:", error);
    throw error;
  }
}

/**
 * Fetch all available pets (pets with AVAILABLE status)
 * @returns {Promise<Array>} List of available pets
 */
async function fetchAvailablePets() {
  try {
    const response = await fetch(`${API_URL}/available`);
    
    if (!response.ok) {
      console.error("Failed to fetch available pets. Response status:", response.status);
      throw new Error(`Failed to fetch available pets: ${response.status} ${response.statusText}`);
    }
    
    const allPets = await response.json();
    return processPetPhotos(allPets);
  } catch (error) {
    console.error("Failed to fetch available pets:", error);
    return [];
  }
}

/**
 * Fetch all pets belonging to a specific shelter
 * @param {number} shelterId - ID of the shelter
 * @returns {Promise<Array>} List of pets for the shelter
 */
async function fetchShelterPets(shelterId) {
  try {
    console.log(`Fetching pets for shelter ID: ${shelterId}`);

    const response = await fetch(`${API_URL}/${shelterId}`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pets: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return processPetPhotos(data);
  } catch (error) {
    console.error("Error fetching shelter pets:", error);
    return [];
  }
}

/**
 * Get the count of pets that need urgent adoption
 * @returns {Promise<number>} Count of pets needing urgent adoption
 */
async function getUrgentPetsCount() {
  try {
    const response = await fetch(`${API_URL}/available`);
    
    if (!response.ok) {
      console.error("Failed to fetch pets for emergency banner");
      return 0;
    }
    
    const pets = await response.json();
    return pets.filter(pet => pet.urgentAdoptionNeeded).length;
  } catch (error) {
    console.error("Error fetching urgent pets count:", error);
    return 0;
  }
}

/**
 * Get the total count of pets for a specific shelter
 * @param {number} shelterId - ID of the shelter
 * @returns {Promise<number>} Total number of pets for the shelter
 */
async function getPetCountByShelter(shelterId) {
  try {
    const response = await fetch(`${API_URL}/count/${shelterId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch pet count: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching pet count:", error);
    throw error;
  }
}

/**
 * Fetch pet statistics for a specific shelter
 * @param {number} shelterId - ID of the shelter
 * @returns {Promise<Object>} Pet statistics including counts by status
 */
async function fetchShelterPetStats(shelterId) {
  try {
    console.log(`Fetching pet statistics for shelter ID: ${shelterId}`);

    const response = await fetch(`${API_URL}/stats/${shelterId}`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pet statistics: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching pet statistics:", error);
    return {
      adopted: 0,
      pending: 0,
      available: 0,
      total: 0,
      urgent: 0
    };
  }
}

/**
 * Get a pet by its ID
 * @param {number} petId - ID of the pet
 * @returns {Promise<Object>} Pet data
 */
async function getPetById(petId) {
  try {
    console.log(`Fetching pet with ID: ${petId}`);

    const response = await fetch(`${API_URL}/${petId}`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pet: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return processPetPhotos(data);
  } catch (error) {
    console.error("Error fetching pet:", error);
    throw error;
  }
}

/**
 * Get available breeds for a specific species
 * @param {string} species - The species (e.g., "Dog", "Cat")
 * @returns {Promise<Array<string>>} List of breed names
 */
async function getBreedsBySpecies(species) {
  try {
    if (!species) {
      return [];
    }
    
    console.log(`Fetching breeds for species: ${species}`);
    
    const response = await fetch(`${API_URL}/breedsBySpecies?species=${encodeURIComponent(species)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch breeds: ${response.status} ${response.statusText}`);
    }
    
    const textResponse = await response.text();
    const data = JSON.parse(textResponse);
    
    return Array.isArray(data) ? data.map(b => b.trim()) : [];
  } catch (error) {
    console.error("Error fetching breeds by species:", error);
    return [];
  }
}

/**
 * Get a pet photo by its ID
 * @param {number} photoId - ID of the photo
 * @returns {Promise<Object>} Photo data with URL
 */
async function getPetPhotoById(photoId) {
  try {
    const response = await fetch(`${PHOTO_API_URL}/${photoId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching pet photo: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching pet photo with ID ${photoId}:`, error);
    throw error;
  }
}

/**
 * Get multiple pet photos from a list of photo IDs
 * @param {Array<number>} photoIds - Array of photo IDs
 * @returns {Promise<Array<Object>>} Array of photo data objects
 */
async function getPetPhotosFromIds(photoIds) {
  if (!photoIds || !photoIds.length) {
    return [];
  }
  
  try {
    return await Promise.all(
      photoIds.map(async (id) => {
        const data = await getPetPhotoById(id);
        return { url: data.url };
      })
    );
  } catch (error) {
    console.error('Error fetching multiple pet photos:', error);
    throw error;
  }
}

/**
 * Get all available breeds
 * @returns {Promise<Array<string>>} List of all breed names
 */
async function getAllBreeds() {
  try {
    const response = await fetch(`${API_URL}/breeds`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch breeds: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching all breeds:", error);
    return [];
  }
}

export { 
  // Pet CRUD operations
  addPet,
  updatePet,
  deletePet,
  
  // Pet retrieval
  getPetById,
  fetchAvailablePets,
  fetchShelterPets,
  
  // Statistics and counts
  getUrgentPetsCount,
  getPetCountByShelter,
  fetchShelterPetStats,
  
  // Breeds and species information
  getBreedsBySpecies,
  getAllBreeds,
  
  // Photo management
  getPetPhotoById,
  getPetPhotosFromIds
};