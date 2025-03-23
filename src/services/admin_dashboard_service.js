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


export { 
    getTotalShelterCount,
    getPendingShelterCount,
    getTotalUserCount,
    getTotalAnimalCount,
};