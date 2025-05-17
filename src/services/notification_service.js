const BASE_URL = 'http://localhost:8080';
const API_PATH = '/api/notifications';

/**
 * Function to create authorized headers with JWT token
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
 * Fetch all notifications for a shelter
 * @param {number} shelterId - The ID of the shelter
 * @returns {Promise<Array>} List of notifications for the shelter
 * @throws {Error} If the request fails
 */
export const fetchShelterNotifications = async (shelterId) => {
  try {
    const response = await fetch(`${BASE_URL}${API_PATH}/shelter/${shelterId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch shelter notifications: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching shelter notifications:', error);
    throw error;
  }
};

/**
 * Fetch all notifications for an adopter
 * @param {number} adopterId - The ID of the adopter
 * @returns {Promise<Array>} List of notifications for the adopter
 * @throws {Error} If the request fails
 */
export const fetchAdopterNotifications = async (adopterId) => {
  try {
    const response = await fetch(`${BASE_URL}${API_PATH}/adopter/${adopterId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch adopter notifications: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching adopter notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {number} notificationId - The ID of the notification to mark as read
 * @returns {Promise<void>} Promise that resolves when the notification is marked as read
 * @throws {Error} If the request fails
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await fetch(`${BASE_URL}${API_PATH}/${notificationId}/mark-read`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to mark notification as read: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Get the count of unread notifications for a user
 * @param {number} userId - The ID of the user (shelter or adopter)
 * @param {string} userType - The type of user ('shelter' or 'adopter')
 * @returns {Promise<number>} The count of unread notifications
 */
export const getUnreadNotificationCount = async (userId, userType) => {
  try {
    if (!['shelter', 'adopter'].includes(userType)) {
      throw new Error('Invalid user type. Must be "shelter" or "adopter"');
    }
    
    const response = await fetch(`${BASE_URL}${API_PATH}/${userType}/${userId}/unread-count`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch unread notification count: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return 0; // Return 0 as default in case of error
  }
};

/**
 * Delete a notification
 * @param {number} notificationId - The ID of the notification to delete
 * @returns {Promise<void>} Promise that resolves when the notification is deleted
 * @throws {Error} If the request fails
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await fetch(`${BASE_URL}${API_PATH}/${notificationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete notification: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};


export default {
  fetchShelterNotifications,
  fetchAdopterNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount,
  deleteNotification
};