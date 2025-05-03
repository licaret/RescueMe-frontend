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

    const data = await response.json();

    return data;
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
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    
    localStorage.setItem("token", data.token);
    localStorage.setItem("Id", data.id);
    localStorage.setItem("Username", data.username);
    localStorage.setItem("Role", data.role);
    
    if (data.role === "SHELTER") {
      if (data.first_login_after_approval == true) {
        localStorage.setItem("firstLogin", "true");
      } else {
        localStorage.removeItem("firstLogin");
      }
    }
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

async function logout() {
  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include", 
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Logout failed: ${error}`);
    }

    localStorage.clear();

    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}


async function checkEmailExists(email) {
  try {
    const response = await fetch(`${API_URL}/check-email?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      console.error("Raw response:", response);
      throw new Error("Failed to check email: " + response.status);
    }

    const data = await response.json();
    return data.emailExists;
  } catch (error) {
    console.error("Error in checkEmailExists:", error);
    throw new Error("Failed to check email: " + error.message);
  }
}


async function checkUsernameExists(username) {
  try {
    const response = await fetch(`${API_URL}/check-username?username=${encodeURIComponent(username)}`);
    if (!response.ok) {
      console.error("Raw response:", response);
      throw new Error("Failed to check username: " + response.status);
    }

    const data = await response.json();
    return data.usernameExists;
  } catch (error) {
    console.error("Error in checkUsernameExists:", error);
    throw new Error("Failed to check username: " + error.message);
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

async function resetPassword(token, newPassword) {
  console.log("Service called with token:", token, "and password:", newPassword);
  const response = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    throw new Error("Failed to reset password");
  }

  return await response.json();
}

async function requestPasswordReset(email) {
  try {
    const response = await fetch(`${API_URL}/request-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server returned an invalid response.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send reset link");
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error sending reset link:", error);
    return { success: false, message: error.message };
  }
}


async function changePassword(userId, currentPassword, newPassword) {
  console.log("Sending password change request:", { userId, currentPassword, newPassword });
  try {
    const response = await fetch(`http://localhost:8080/users/${userId}/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword,
      }),
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      console.log("Error content type:", contentType);
      
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        console.log("Error data received:", errorData);
        throw new Error(errorData.message || "Failed to change password");
      } else {
        const textResponse = await response.text();
        console.log("Error text response:", textResponse);
        throw new Error(`Server responded with status: ${response.status}`);
      }
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Success response:", data);
      return data;
    } else {
      console.log("Non-JSON success response");
      return { success: true };
    }
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}



const uploadShelterDocument = async (Id, documentType, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    const response = await fetch(`${API_BASE_URL}/shelters/${Id}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload document');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error uploading ${documentType} document:`, error);
    throw error;
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


async function updateUser(userId, updatedFields) {
  try {
    const token = localStorage.getItem("token"); 

    const response = await fetch(`http://localhost:8080/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedFields)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}


async function fetchProfilePicture(userId) {
  try {
    const response = await fetch(`http://localhost:8080/users/${userId}/profilePicture?t=${Date.now()}`);
    if (!response.ok) throw new Error("Image not found");

    const blob = await response.blob();
    if (blob.size === 0) {
      console.warn("No image data received.");
      return null;
    }

    return URL.createObjectURL(blob);
  } catch (error) {
    console.warn("No profile picture available:", error);
    return null;
  }
}


async function uploadProfilePicture(userId, file) {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    await fetch(`http://localhost:8080/users/${userId}/uploadProfilePicture`, {
      method: "POST",
      body: formData,
    });
    return await fetchProfilePicture(userId);
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
}


async function deleteProfilePicture(userId) {
  try {
    const response = await fetch(`http://localhost:8080/users/${userId}/profilePicture`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete profile picture");
    }

    return true;
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    throw error;
  }
}


const getShelterByPetId = async (petId) => {
  try {
    const response = await fetch(`http://localhost:8080/users/shelter/by-pet/${petId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching shelter: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getShelterByPetId:', error);
    throw error;
  }
};


export { 
  registerAdopter, 
  registerShelter, 
  login, 
  logout,
  fetchWithAuth, 
  checkEmailExists, 
  checkUsernameExists, 
  getUserById, 
  updateUser, 
  fetchProfilePicture, 
  uploadProfilePicture, 
  deleteProfilePicture,
  requestPasswordReset,
  resetPassword,
  changePassword,
  uploadShelterDocument,
  getShelterByPetId
 };
