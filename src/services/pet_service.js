async function fetchShelterPets(shelterId) {
  try {
    console.log(`Fetching pets for shelter ID: ${shelterId}`);

    const response = await fetch(`http://localhost:8080/pets/${shelterId}`, {
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

    const processedData= data.map(pet => ({
      ...pet,
      photoUrls: pet.photoUrls ? pet.photoUrls : [] 
    }));

    //console.log("Processed pets data:", processedData);
    return processedData;

  } catch (error) {
    console.error("Error occurred while fetching pets:", error);
    return [];
  }
}





async function deletePet(shelterId, petId) {
  try {
    const response = await fetch(`http://localhost:8080/pets/${shelterId}/delete/${petId}`, {
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


async function updatePet(shelterId, petId, petData, photos) {
  try {
    console.log(`Updating pet with ID ${petId} from shelter ID ${shelterId}...`);

    const formData = new FormData();

    formData.append("petData", JSON.stringify(petData));

    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    const response = await fetch(`http://localhost:8080/pets/update/${petId}`, {
      method: "PUT",
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


export { fetchShelterPets, deletePet, updatePet };
