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

    //console.log("Response status:", response.status);

    if (!response.ok) {
      console.error("Failed to fetch pets. Response status:", response.status);
      throw new Error("Failed to fetch pets");
    }

    const data = await response.json();
    //console.log("Raw pets data:", data);

    const processedData = data.map(pet => ({
      ...pet,
      photos: pet.photos ? pet.photos.map(photo => ({
        id: photo.id,
        url: photo.url.startsWith("data:image") ? photo.url : `data:image/jpeg;base64,${photo.url}`
      })) : []
    }));
    
    

    //console.log("Processed pets data:", processedData);
    return processedData;

  } catch (error) {
    console.error("Error occurred while fetching pets:", error);
    return [];
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

    // 🔄 Adăugăm datele despre animal
    formData.append("petData", JSON.stringify(petData));

    // 🖼️ Adăugăm noile poze dacă există
    if (photos && photos.length > 0) {
      photos.forEach((photo) => {
        formData.append("photos", photo);
      });
    }

    // 🚨 Adăugăm ID-urile pozelor care trebuie șterse (dacă există)
    if (photoIdsToDelete.length > 0) {
      formData.append("photoIdsToDelete", JSON.stringify(photoIdsToDelete));
    }

    const response = await fetch(`http://localhost:8080/pets/update/${petId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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

const getPetCountByShelter = async (Id) => {
  const response = await fetch(`http://localhost:8080/pets/count/${Id}`);
  if (!response.ok) {
      throw new Error('Failed to fetch pet count');
  }
  return await response.json();
};

export { fetchShelterPets, deletePet, updatePet, getPetCountByShelter };
