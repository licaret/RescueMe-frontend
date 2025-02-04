async function fetchShelterPets(shelterId) {
  try {
    const response = await fetch(`http://localhost:8080/pets/${shelterId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Dacă folosești autentificare cu token
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pets");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching shelter pets:", error);
    return [];
  }
}

export { fetchShelterPets };
