const API_BASE_URL = "http://localhost:8080/api/v1";


async function getShelterProfile(Id) {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}/shelters/${Id}/profile`, {
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


async function checkWelcomeStatus(Id) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/shelters/${Id}/check-welcome`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to check welcome status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking welcome status:', error);
    return { showWelcome: false };
  }
}



async function acknowledgeWelcome(Id) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/shelters/${Id}/acknowledge-welcome`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to acknowledge welcome');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error acknowledging welcome:', error);
    throw error;
  }
}



async function saveShelterProfileDraft(Id, profileData) {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}/shelters/${Id}/profile/draft`, {
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


async function submitShelterProfile(Id, profileData) {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}/shelters/${Id}/profile/submit`, {
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


async function uploadDocument(Id, documentType, file) {
  if (!Id || !documentType || !file) {
    throw new Error("Missing required parameters");
  }
  
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("File size exceeds maximum allowed (2MB)");
  }
  
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only PDF, JPEG, and PNG files are accepted");
  }
  
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    
    console.log(`Uploading ${documentType} document for shelter ${Id}`);
    console.log(`File name: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
    
    const response = await fetch(`${API_BASE_URL}/shelters/${Id}/documents/${documentType}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
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


async function deleteDocument(Id, documentType) {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}/shelters/${Id}/documents/${documentType}`, {
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


async function getDocumentStatus(shelterId) {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}/shelters/${shelterId}/documents/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch document status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching document status:", error);
    throw error;
  }
}


function getDocumentUrl(Id, documentType) {
  return `${API_BASE_URL}/shelters/${Id}/documents/${documentType}?t=${Date.now()}`;
}


export {
  getShelterProfile,
  checkWelcomeStatus,
  acknowledgeWelcome,
  saveShelterProfileDraft,
  submitShelterProfile,
  uploadDocument,
  deleteDocument,
  getDocumentStatus,
  getDocumentUrl
};