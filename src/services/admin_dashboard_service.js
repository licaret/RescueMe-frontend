const API_URL = 'http://localhost:8080/api/v1/admin';

/**
 * Function to create authorized headers with JWT token
 * @returns {Object} Headers object with Authorization and Content-Type
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Fetch the total number of shelters in the system
 * @returns {Promise<number>} Total number of shelters
 */
async function getTotalShelterCount() {
  const response = await fetch(`${API_URL}/shelters/count`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`Error fetching shelter count: ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetch the number of shelters with pending approval
 * @returns {Promise<number>} Number of pending shelters
 */
async function getPendingShelterCount() {
  const response = await fetch(`${API_URL}/shelters/pending/count`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`Error fetching pending shelter count: ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetch the total number of users in the system
 * @returns {Promise<number>} Total number of users
 */
async function getTotalUserCount() {
  const response = await fetch(`${API_URL}/users/count`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`Error fetching user count: ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetch the total number of animals/pets in the system
 * @returns {Promise<number>} Total number of animals
 */
async function getTotalAnimalCount() {
  const response = await fetch(`${API_URL}/pets/count`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`Error fetching animal count: ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetch all shelters with a pending status
 * @returns {Promise<Array>} List of pending shelter objects
 */
const getPendingShelters = async () => {
  try {
    const response = await fetch(`${API_URL}/shelters/pending`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch pending shelters');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching pending shelters:', error);
    throw error;
  }
};

/**
 * Fetch all approved shelters
 * @returns {Promise<Array>} List of approved shelter objects
 */
const getApprovedShelters = async () => {
  try {
    const response = await fetch(`${API_URL}/shelters/approved`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching approved shelters:', error);
    throw error;
  }
};

/**
 * Get detailed information about a specific shelter
 * @param {number} Id - The shelter ID
 * @returns {Promise<Object>} Detailed shelter information including document status
 */
const getShelterDetails = async (Id) => {
  try {
    const profileResponse = await fetch(`http://localhost:8080/api/v1/shelters/${Id}/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!profileResponse.ok) {
      throw new Error('Failed to fetch shelter profile');
    }
    const profileData = await profileResponse.json();
    
    const documentsResponse = await fetch(`http://localhost:8080/api/v1/shelters/${Id}/documents/status`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!documentsResponse.ok) {
      throw new Error('Failed to fetch document status');
    }
    const documentsData = await documentsResponse.json();
    
    return {
      ...profileData,
      documents: documentsData
    };
  } catch (error) {
    console.error('Error fetching shelter details:', error);
    throw error;
  }
};

/**
 * Approve a shelter's registration
 * @param {number} Id - The shelter ID to approve
 * @returns {Promise<Object>} Response confirming approval
 */
async function approveShelter(Id) {
  try {
    const response = await fetch(`${API_URL}/shelters/${Id}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      throw new Error(`Error approving shelter: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error approving shelter:', error);
    throw error;
  }
}

/**
 * Reject a shelter's registration with detailed reason
 * @param {number} Id - The shelter ID to reject
 * @param {Object} rejectionData - The rejection details
 * @returns {Promise<Object>} Response confirming rejection
 */
async function rejectShelter(Id, rejectionData) {
  try {
    const response = await fetch(`${API_URL}/shelters/${Id}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(rejectionData)
    });
    
    if (!response.ok) {
      throw new Error(`Error rejecting shelter: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error rejecting shelter:', error);
    throw error;
  }
}

/**
 * Suspend an active shelter
 * @param {number} Id - The shelter ID to suspend
 * @returns {Promise<Object>} Response confirming suspension
 */
async function suspendShelter(Id) {
  try {
    const response = await fetch(`${API_URL}/shelters/${Id}/suspend`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      throw new Error(`Error suspending shelter: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error suspending shelter:', error);
    throw error;
  }
}

/**
 * Convert a byte array to a base64-encoded image URL
 * @param {Uint8Array} byteArray - The image data as a byte array
 * @param {string} mimeType - The image MIME type (default: image/jpeg)
 * @returns {string|null} Base64-encoded image URL or null if conversion fails
 */
const byteArrayToImageUrl = (byteArray, mimeType = 'image/jpeg') => {
  if (!byteArray || !byteArray.length) {
    return null;
  }
  
  try {
    let binary = '';
    const bytes = new Uint8Array(byteArray);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64String = btoa(binary);
    
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error('Error converting byte array to base64:', error);
    return null;
  }
};


export { 
  // Dashboard statistics
  getTotalShelterCount,
  getPendingShelterCount,
  getTotalUserCount,
  getTotalAnimalCount,
  
  // Shelter listing functions
  getPendingShelters,
  getApprovedShelters,
  getShelterDetails,
  
  // Shelter management actions
  approveShelter,
  rejectShelter,
  suspendShelter,
  
  // Utility functions
  byteArrayToImageUrl,
};