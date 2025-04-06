const API_URL = 'http://localhost:8080/api/v1';


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



async function submitAdoptionRequest(adoptionData) {
  try {
    const token = localStorage.getItem('token');
    
    console.log('Sending adoption request:', adoptionData);
    
    const cleanData = JSON.parse(JSON.stringify(adoptionData));
    
    const response = await fetch(`${API_URL}/adoptions/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(cleanData),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error submitting adoption request:', error);
    throw error;
  }
}


async function getUserAdoptionRequests(userId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/adoptions/requests/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching user adoption requests:', error);
    throw error;
  }
}


async function getShelterAdoptionRequests(shelterId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/adoptions/requests/shelter/${shelterId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching shelter adoption requests:', error);
    throw error;
  }
}



async function getAdoptionRequestById(requestId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/adoptions/requests/${requestId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching adoption request details:', error);
    throw error;
  }
}



async function updateAdoptionRequestStatus(requestId, status, notes) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/adoptions/requests/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, notes }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating adoption request status:', error);
    throw error;
  }
}



async function cancelAdoptionRequest(requestId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/adoptions/requests/${requestId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error canceling adoption request:', error);
    throw error;
  }
}


const completeAdoption = async (requestId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/adoptions/requests/${requestId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to complete adoption');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error completing adoption:', error);
    throw error;
  }
};


export { 
  submitAdoptionRequest,
  getUserAdoptionRequests,
  getShelterAdoptionRequests,
  getAdoptionRequestById,
  updateAdoptionRequestStatus,
  cancelAdoptionRequest,
  completeAdoption
};