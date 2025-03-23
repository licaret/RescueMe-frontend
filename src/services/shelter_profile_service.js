// shelter_profile_service.js
const API_BASE_URL = "http://localhost:8080/api/v1";

/**
 * Fetches shelter profile data from the server
 * @param {string} shelterId - The ID of the shelter
 * @returns {Promise<Object>} - The shelter profile data
 */
async function getShelterProfile(shelterId) {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}/shelters/${shelterId}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch shelter profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching shelter profile:", error);
    throw error;
  }
}

/**
 * Saves shelter profile as a draft
 * @param {string} shelterId - The ID of the shelter
 * @param {Object} profileData - The profile data to save
 * @returns {Promise<Object>} - Response from the server
 */
async function saveShelterProfileDraft(shelterId, profileData) {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}/shelters/${shelterId}/profile/draft`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save profile draft");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving profile draft:", error);
    throw error;
  }
}

/**
 * Submits shelter profile for approval
 * @param {string} shelterId - The ID of the shelter
 * @param {Object} profileData - The complete profile data to submit
 * @returns {Promise<Object>} - Response from the server
 */
async function submitShelterProfile(shelterId, profileData) {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}/shelters/${shelterId}/profile/submit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting profile:", error);
    throw error;
  }
}

/**
 * Uploads a document for a shelter
 * @param {string} shelterId - The ID of the shelter
 * @param {string} documentType - The type of document (taxCertificate, vetAuthorization, vetContract, idCard)
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - Response from the server
 */
async function uploadDocument(shelterId, documentType, file) {
  // Validate inputs
  if (!shelterId || !documentType || !file) {
    throw new Error("Missing required parameters");
  }
  
  // Validate file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("File size exceeds maximum allowed (2MB)");
  }
  
  // Validate file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only PDF, JPEG, and PNG files are accepted");
  }
  
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    
    console.log(`Uploading ${documentType} document for shelter ${shelterId}`);
    console.log(`File name: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
    
    const response = await fetch(`${API_BASE_URL}/shelters/${shelterId}/documents/${documentType}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
        // Do NOT set Content-Type here - it will be set automatically
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to upload document: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error uploading ${documentType} document:`, error);
    throw error;
  }
}

/**
 * Deletes a document for a shelter
 * @param {string} shelterId - The ID of the shelter
 * @param {string} documentType - The type of document (taxCertificate, vetAuthorization, vetContract, idCard)
 * @returns {Promise<Object>} - Response from the server
 */
async function deleteDocument(shelterId, documentType) {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}/shelters/${shelterId}/documents/${documentType}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to delete document: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting ${documentType} document:`, error);
    throw error;
  }
}

/**
 * Gets the URL for a document
 * @param {string} shelterId - The ID of the shelter
 * @param {string} documentType - The type of document
 * @returns {string} - URL for the document
 */
function getDocumentUrl(shelterId, documentType) {
  return `${API_BASE_URL}/shelters/${shelterId}/documents/${documentType}?t=${Date.now()}`;
}

export {
  getShelterProfile,
  saveShelterProfileDraft,
  submitShelterProfile,
  uploadDocument,
  deleteDocument,
  getDocumentUrl
};