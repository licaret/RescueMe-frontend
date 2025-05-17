const API_URL = 'http://localhost:8080/api/v1/favorites';

/**
 * Helper function to create authorized headers with JWT token
 * @param {Object} additionalHeaders - Any additional headers to include
 * @returns {Object} Headers object with Authorization and Content-Type
 */
const getAuthHeaders = (additionalHeaders = {}) => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...additionalHeaders
  };
};

/**
 * Get all favorites for a user
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} List of pet IDs that the user has favorited
 */
const getFavorites = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/${userId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

/**
 * Add a pet to a user's favorites
 * @param {number} userId - The ID of the user
 * @param {number} petId - The ID of the pet to add to favorites
 * @returns {Promise<Object>} Response confirming the addition
 */
const addToFavorites = async (userId, petId) => {
  try {
    const response = await fetch(`${API_URL}/${userId}/${petId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    window.dispatchEvent(new Event('favorites-updated'));
    
    return await response.json();
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

/**
 * Remove a pet from a user's favorites
 * @param {number} userId - The ID of the user
 * @param {number} petId - The ID of the pet to remove from favorites
 * @returns {Promise<Object>} Response confirming the removal
 */
const removeFromFavorites = async (userId, petId) => {
  try {
    const response = await fetch(`${API_URL}/${userId}/${petId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    window.dispatchEvent(new Event('favorites-updated'));
    
    return await response.json();
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

/**
 * Check if a pet is in a user's favorites
 * @param {number} userId - The ID of the user
 * @param {number} petId - The ID of the pet to check
 * @returns {Promise<boolean>} True if the pet is a favorite, false otherwise
 */
const checkIfFavorite = async (userId, petId) => {
  try {
    const response = await fetch(`${API_URL}/check/${userId}/${petId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.isFavorite;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

/**
 * Get the count of favorites for a user
 * @param {number} userId - The ID of the user
 * @returns {Promise<number>} The number of favorites
 */
const getFavoritesCount = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/count/${userId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error getting favorites count:', error);
    return 0;
  }
};


export { 
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  checkIfFavorite,
  getFavoritesCount
};