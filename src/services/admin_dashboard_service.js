// src/services/admin_dashboard_service.js

const API_URL = 'http://localhost:8080/api/v1/admin';


/**
 * Retrieve the total number of shelters
 * @returns {Promise<number>} Total shelter count
 */
async function getTotalShelterCount() {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/shelters/count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching shelter count: ${response.status}`);
    }

    return await response.json();
}

async function getPendingShelterCount() {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/shelters/pending/count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error(`Error fetching pending shelter count: ${response.status}`);
    }
  
    return await response.json();
}

async function getTotalUserCount() {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/users/count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching user count: ${response.status}`);
    }

    return await response.json();
}

async function getTotalAnimalCount() {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/pets/count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching animal count: ${response.status}`);
    }

    return await response.json();
}

const getPendingShelters = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/admin/shelters/pending');
        if (!response.ok) {
        throw new Error('Failed to fetch pending shelters');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching pending shelters:', error);
        throw error;
    }
};

const getApprovedShelters = async () => {
  try {
      const response = await fetch('http://localhost:8080/api/v1/admin/shelters/approved');
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Error fetching approved shelters:', error);
      throw error;
  }
};

const getShelterDetails = async (shelterId) => {
    try {
      // Fetch shelter profile
      const profileResponse = await fetch(`http://localhost:8080/api/v1/shelters/${shelterId}/profile`);
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch shelter profile');
      }
      const profileData = await profileResponse.json();
      
      // Fetch document status
      const documentsResponse = await fetch(`http://localhost:8080/api/v1/shelters/${shelterId}/documents/status`);
      if (!documentsResponse.ok) {
        throw new Error('Failed to fetch document status');
      }
      const documentsData = await documentsResponse.json();
      
      // Combine the data
      return {
        ...profileData,
        documents: documentsData
      };
    } catch (error) {
      console.error('Error fetching shelter details:', error);
      throw error;
    }
  };

  // Image utility functions for your application

/**
 * Converts a byte array to a base64 image URL
 * Works with various image formats but defaults to JPEG
 */
export const byteArrayToImageUrl = (byteArray, mimeType = 'image/jpeg') => {
    if (!byteArray || !byteArray.length) {
        return null;
    }
    
    try {
        // Convert byte array to base64 string
        let binary = '';
        const bytes = new Uint8Array(byteArray);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const base64String = btoa(binary);
        
        // Return as data URL with appropriate mime type
        return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
        console.error('Error converting byte array to base64:', error);
        return null;
    }
};

async function checkWelcomeStatus(shelterId) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/shelters/${shelterId}/check-welcome`, {
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

// Acknowledge welcome page has been seen
async function acknowledgeWelcome(shelterId) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/shelters/${shelterId}/acknowledge-welcome`, {
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


export { 
    getTotalShelterCount,
    getPendingShelterCount,
    getTotalUserCount,
    getTotalAnimalCount,
    getPendingShelters,
    getApprovedShelters,
    getShelterDetails,
    checkWelcomeStatus,
    acknowledgeWelcome,
};