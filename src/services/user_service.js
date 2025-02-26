const API_URL = "http://localhost:8080/api/v1/auth";

async function registerAdopter(adopterData) {
  try {
    const response = await fetch(`${API_URL}/register/adopter`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify(adopterData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register adopter");
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering adopter:", error);
    throw error;
  }
}

async function registerShelter(shelterData) {
  try {
    const response = await fetch(`${API_URL}/register/shelter`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(shelterData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register shelter");
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering shelter:", error);
    throw error;
  }
}

async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch");
  }

  return await response.json();
}


async function checkEmailExists(email) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/auth/check-email?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      console.error("Raw response:", response);
      throw new Error("Failed to check email: " + response.status);
    }

    const data = await response.json();
    // console.log("Parsed data:", data);
    return data.emailExists;
  } catch (error) {
    console.error("Error in checkEmailExists:", error);
    throw new Error("Failed to check email: " + error.message);
  }
}


async function checkUsernameExists(username) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/auth/check-username?username=${encodeURIComponent(username)}`);
    if (!response.ok) {
      console.error("Raw response:", response);
      throw new Error("Failed to check username: " + response.status);
    }

    const data = await response.json();
    // console.log("Parsed data:", data);
    return data.usernameExists;
  } catch (error) {
    console.error("Error in checkUsernameExists:", error);
    throw new Error("Failed to check username: " + error.message);
  }
}


async function getUserById(userId) {
  try {
    const response = await fetchWithAuth(`http://localhost:8080/users/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

export { registerAdopter, registerShelter, login, fetchWithAuth, checkEmailExists, checkUsernameExists, getUserById };
