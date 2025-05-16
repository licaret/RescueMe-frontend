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
    
    const response = await fetch("http://localhost:8080/pets/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Id": localStorage.getItem("Id"),
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add pet: ${await response.text()}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error adding pet:", error);
    throw error;
  }
}


async function deletePet(Id, petId) {
  try {
    const response = await fetch(`http://localhost:8080/pets/${Id}/delete/${petId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete pet");
    }

    return true; 
  } catch (error) {
    console.error("Error deleting pet:", error);
    return false; 
  }
}


async function updatePet(Id, petId, petData, photos, photoIdsToDelete = []) {
  try {
    console.log(`Updating pet with ID ${petId} from shelter ID ${Id}...`);

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

    const response = await fetch(`http://localhost:8080/pets/update/${petId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Id": Id 
      },
      body: formData,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to update pet. Status: ${response.status}`);
    }

    const updatedPet = await response.json();
    console.log("Updated pet data:", updatedPet);

    return updatedPet; 
  } catch (error) {
    console.error("Error updating pet:", error);
    throw error;
  }
}


async function fetchAvailablePets() {
  try {
    const response = await fetch(`http://localhost:8080/pets/available`);
    
    if (!response.ok) {
      console.error("Failed to fetch available pets. Response status:", response.status);
      throw new Error("Failed to fetch available pets");
    }
    
    const allPets = await response.json();
    
    const processedData = allPets.map(pet => ({
      ...pet,
      photos: pet.photos ? pet.photos.map(photo => ({
        id: photo.id,
        url: photo.url.startsWith("data:image") ? photo.url : `data:image/jpeg;base64,${photo.url}`
      })) : []
    }));
    
    return processedData;
  } catch (error) {
    console.error("Failed to fetch available pets:", error);
    return [];
  }
}


async function fetchShelterPets(Id) {
  try {
    console.log(`Fetching pets for shelter ID: ${Id}`);

    const response = await fetch(`http://localhost:8080/pets/${Id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch pets. Response status:", response.status);
      throw new Error("Failed to fetch pets");
    }

    const data = await response.json();

    const processedData = data.map(pet => ({
      ...pet,
      photos: pet.photos ? pet.photos.map(photo => ({
        id: photo.id,
        url: photo.url.startsWith("data:image") ? photo.url : `data:image/jpeg;base64,${photo.url}`
      })) : []
    }));
    
    return processedData;

  } catch (error) {
    console.error("Error occurred while fetching pets:", error);
    return [];
  }
}

async function getUrgentPetsCount() {
  try {
    const response = await fetch('http://localhost:8080/pets/available');
    
    if (!response.ok) {
      console.error("Failed to fetch pets for emergency banner");
      return 0;
    }
    
    const pets = await response.json();
    const urgentCount = pets.filter(pet => pet.urgentAdoptionNeeded).length;
    
    return urgentCount;
  } catch (error) {
    console.error("Error fetching urgent pets count:", error);
    return 0;
  }
}


const getPetCountByShelter = async (Id) => {
  const response = await fetch(`http://localhost:8080/pets/count/${Id}`);
  if (!response.ok) {
      throw new Error('Failed to fetch pet count');
  }
  return await response.json();
};



async function fetchShelterPetStats(Id) {
  try {
    console.log(`Fetching pet statistics for shelter ID: ${Id}`);

    const response = await fetch(`http://localhost:8080/pets/stats/${Id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch pet statistics. Response status:", response.status);
      throw new Error("Failed to fetch pet statistics");
    }

    const data = await response.json();
    console.log("Pet statistics data:", data);
    return data;

  } catch (error) {
    console.error("Error occurred while fetching pet statistics:", error);
    return null;
  }
}


async function getPetById(petId) {
  try {
    console.log(`Fetching pet with ID: ${petId}`);

    const response = await fetch(`http://localhost:8080/pets/${petId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch pet. Response status:", response.status);
      throw new Error("Failed to fetch pet");
    }

    const data = await response.json();
    
    const processedData = {
      ...data,
      photos: data.photos ? data.photos.map(photo => ({
        id: photo.id,
        url: photo.url.startsWith("data:image") ? photo.url : `data:image/jpeg;base64,${photo.url}`
      })) : []
    };
    
    console.log("Processed pet data:", processedData);
    return processedData;

  } catch (error) {
    console.error("Error occurred while fetching pet:", error);
    throw error;
  }
}

async function getBreedsBySpecies(species) {
  try {
    if (!species) {
      return [];
    }
    
    console.log(`Fetching breeds for species: ${species}`);
    
    const response = await fetch(`http://localhost:8080/pets/breedsBySpecies?species=${species}`);
    
    if (!response.ok) {
      console.error("Failed to fetch breeds. Response status:", response.status);
      throw new Error(`Failed to fetch breeds: ${response.status}`);
    }
    
    const textResponse = await response.text();
    const data = JSON.parse(textResponse);
    
    return Array.isArray(data) ? data.map(b => b.trim()) : [];
    
  } catch (error) {
    console.error("Error fetching breeds by species:", error);
    return [];
  }
}

async function getPetPhotoById(photoId) {
  try {
    const response = await fetch(`http://localhost:8080/pet-photos/${photoId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching pet photo: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching pet photo with ID ${photoId}:`, error);
    throw error;
  }
}

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


export { 
  addPet,
  deletePet, 
  updatePet, 
  fetchAvailablePets,
  fetchShelterPets, 
  getUrgentPetsCount,
  getPetCountByShelter, 
  fetchShelterPetStats, 
  getPetById,
  getBreedsBySpecies,
  getPetPhotoById,
  getPetPhotosFromIds
};
