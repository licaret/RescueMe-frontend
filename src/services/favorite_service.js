const API_URL = 'http://localhost:8080/api/v1/favorites'; 


const getFavorites = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/${userId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};



const addToFavorites = async (userId, petId) => {
  try {
    const response = await fetch(`${API_URL}/${userId}/${petId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
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



const removeFromFavorites = async (userId, petId) => {
  try {
    const response = await fetch(`${API_URL}/${userId}/${petId}`, {
      method: 'DELETE'
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



const checkIfFavorite = async (userId, petId) => {
  try {
    const response = await fetch(`${API_URL}/check/${userId}/${petId}`);
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



const getFavoritesCount = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/count/${userId}`);
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