async function fetchShelterPets(shelterId) {
  try {
    // console.log("Fetching pets for shelter ID:", shelterId);

    const response = await fetch(`http://localhost:8080/pets/${shelterId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // console.log("Response status:", response.status);

    if (!response.ok) {
      console.error("Failed to fetch pets. Response status:", response.status);
      throw new Error("Failed to fetch pets");
    }

    const data = await response.json();
    // console.log("Fetched pets data:", data);

    return data;
  } catch (error) {
      console.error("Error occurred while fetching pets:", error);
      return [];
  }
}

export { fetchShelterPets };
