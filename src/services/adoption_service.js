const API_URL = 'http://localhost:8080/api/v1';

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
 * Handles API responses uniformly, processing different response types and errors
 * @param {Response} response - The fetch API response object
 * @returns {Promise<Object|null>} The processed response data
 * @throws {Error} Throws an error with message from the server if response is not ok
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.clone().json();
      errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
    } catch (e) {
      try {
        errorMessage = await response.clone().text();
      } catch (e2) {
        errorMessage = `Error: ${response.status} ${response.statusText}`;
      }
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  
  if (response.status === 204) {
    return null;
  }
  
  try {
    return await response.json();
  } catch (e) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }
};

/**
 * Submit a new adoption request
 * @param {Object} adoptionData - Data for the adoption request
 * @returns {Promise<Object>} The created adoption request
 */
async function submitAdoptionRequest(adoptionData) {
  try {
    console.log('Sending adoption request:', adoptionData);
    
    const cleanData = JSON.parse(JSON.stringify(adoptionData));
    
    const response = await fetch(`${API_URL}/adoptions/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cleanData),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error submitting adoption request:', error);
    throw error;
  }
}

/**
 * Get all adoption requests for a specific user
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} List of adoption requests for the user
 */
async function getUserAdoptionRequests(userId) {
  try {
    const response = await fetch(`${API_URL}/adoptions/requests/user/${userId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching user adoption requests:', error);
    throw error;
  }
}

/**
 * Get all adoption requests for a specific shelter
 * @param {number} shelterId - The ID of the shelter
 * @returns {Promise<Array>} List of adoption requests for the shelter
 */
async function getShelterAdoptionRequests(shelterId) {
  try {
    const response = await fetch(`${API_URL}/adoptions/requests/shelter/${shelterId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching shelter adoption requests:', error);
    throw error;
  }
}

/**
 * Get details of a specific adoption request by ID
 * @param {string} requestId - The ID of the adoption request
 * @returns {Promise<Object>} The adoption request details
 */
async function getAdoptionRequestById(requestId) {
  try {
    const response = await fetch(`${API_URL}/adoptions/requests/${requestId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching adoption request details:', error);
    throw error;
  }
}

/**
 * Update the status of an adoption request
 * @param {string} requestId - The ID of the adoption request
 * @param {string} status - The new status (APPROVED, REJECTED, etc.)
 * @param {string} notes - Optional notes about the status change
 * @returns {Promise<Object>} The updated adoption request
 */
async function updateAdoptionRequestStatus(requestId, status, notes) {
  try {
    const response = await fetch(`${API_URL}/adoptions/requests/${requestId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating adoption request status:', error);
    throw error;
  }
}

/**
 * Cancel an existing adoption request
 * @param {string} requestId - The ID of the adoption request
 * @returns {Promise<Object|null>} Response confirming cancellation
 */
async function cancelAdoptionRequest(requestId) {
  try {
    const response = await fetch(`${API_URL}/adoptions/requests/${requestId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error canceling adoption request:', error);
    throw error;
  }
}

/**
 * Mark an adoption request as completed (pet is adopted)
 * @param {string} requestId - The ID of the adoption request
 * @returns {Promise<Object>} The completed adoption request
 */
async function completeAdoption(requestId) {
  try {
    const response = await fetch(`${API_URL}/adoptions/requests/${requestId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error completing adoption:', error);
    throw error;
  }
}

/**
 * Check if a user already has an active adoption request for a specific pet
 * @param {number} userId - The ID of the user
 * @param {number} petId - The ID of the pet
 * @returns {Promise<boolean>} True if an active request exists, false otherwise
 */
async function checkExistingRequest(userId, petId) {
  try {
    const requests = await getUserAdoptionRequests(userId);
    return requests.some(request => 
      request.pet.id === petId && 
      ['PENDING', 'APPROVED'].includes(request.status)
    );
  } catch (error) {
    console.error('Error checking existing requests:', error);
    return false;
  }
}


export { 
  // Request submission and management
  submitAdoptionRequest,
  cancelAdoptionRequest,
  updateAdoptionRequestStatus,
  completeAdoption,
  
  // Request retrieval
  getUserAdoptionRequests,
  getShelterAdoptionRequests,
  getAdoptionRequestById,
  
  // Utility functions
  checkExistingRequest
};