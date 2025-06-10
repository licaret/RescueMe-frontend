const API_BASE_URL = 'http://localhost:8080/api/v1/events';

/**
 * Function to create authorized headers with JWT token
 * @param {boolean} includeUserId - Whether to include the userId header
 * @param {Object} additionalHeaders - Any additional headers to include
 * @returns {Object} Headers object with Authorization and Content-Type
 */
const getAuthHeaders = (includeUserId = true, additionalHeaders = {}) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('Id');
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...additionalHeaders
  };
  
  if (includeUserId && userId) {
    headers['userId'] = userId;
  }
  
  return headers;
};

/**
 * Handles response error checking
 * @param {Response} response - The fetch API response
 * @param {string} errorMessage - Custom error message prefix
 * @returns {Promise<any>} - The response JSON data
 */
const handleResponse = async (response, errorMessage) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${errorMessage}: ${errorText}`);
  }
  return await response.json();
};

/**
 * Fetch all events - works with or without authentication
 * @returns {Promise<Array>} - Promise that resolves to an array of all events
 */
export async function fetchAllEvents() {
  try {
    const userId = localStorage.getItem("Id");
    const token = localStorage.getItem("token");
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (userId && token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['userId'] = userId;
    }
    
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: headers,
    });

    return handleResponse(response, "Failed to fetch events");
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
}

/**
 * Fetch shelter events
 * @param {number} shelterId - The ID of the shelter
 * @returns {Promise<Array>} - Promise that resolves to an array of events
 */
export async function fetchShelterEvents(shelterId) {
  try {
    const response = await fetch(`${API_BASE_URL}/shelter/${shelterId}`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });

    return handleResponse(response, "Failed to fetch shelter events");
  } catch (error) {
    console.error('Error fetching shelter events:', error);
    throw error;
  }
}

/**
 * Create a new event
 * @param {Object} eventData - The event data
 * @param {number} shelterId - The ID of the shelter
 * @returns {Promise<Object>} - Promise that resolves to the created event
 */
export async function createEvent(eventData, shelterId) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(false, { 'shelterId': shelterId }),
      body: JSON.stringify(eventData)
    });

    return handleResponse(response, "Failed to create event");
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

/**
 * Update an event
 * @param {number} eventId - The ID of the event
 * @param {Object} eventData - The updated event data
 * @param {number} shelterId - The ID of the shelter
 * @returns {Promise<Object>} - Promise that resolves to the updated event
 */
export async function updateEvent(eventId, eventData, shelterId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${eventId}`, {
      method: 'PUT',
      headers: getAuthHeaders(false, { 'shelterId': shelterId }),
      body: JSON.stringify(eventData)
    });

    return handleResponse(response, "Failed to update event");
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

/**
 * Partially update an event
 * @param {number} eventId - The ID of the event
 * @param {Object} updateData - The partial data to update
 * @param {number} shelterId - The ID of the shelter
 * @returns {Promise<Object>} - Promise that resolves to the updated event
 */
export async function partialUpdateEvent(eventId, updateData, shelterId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${eventId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(false, { 'shelterId': shelterId }),
      body: JSON.stringify(updateData)
    });

    return handleResponse(response, "Failed to partially update event");
  } catch (error) {
    console.error('Error partially updating event:', error);
    throw error;
  }
}

/**
 * Delete an event
 * @param {number} eventId - The ID of the event
 * @param {number} shelterId - The ID of the shelter
 * @returns {Promise<void>}
 */
export async function deleteEvent(eventId, shelterId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${eventId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false, { 'shelterId': shelterId })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete event: ${errorText}`);
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

/**
 * Fetch upcoming events
 * @param {number} userId - Optional user ID
 * @returns {Promise<Array>} - Promise that resolves to an array of upcoming events
 */
export async function fetchUpcomingEvents(userId) {
  try {
    const headers = getAuthHeaders(false);
    if (userId) {
      headers['userId'] = userId;
    }
    
    const response = await fetch(`${API_BASE_URL}/upcoming`, {
      method: 'GET',
      headers: headers
    });

    return handleResponse(response, "Failed to fetch upcoming events");
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
}

/**
 * Fetch upcoming events for a specific shelter
 * @param {number} shelterId - The ID of the shelter
 * @returns {Promise<Array>} - Promise that resolves to an array of upcoming events
 */
export async function fetchUpcomingEventsForShelter(shelterId) {
  try {
    const response = await fetch(`${API_BASE_URL}/upcoming/shelter/${shelterId}`, {
      method: 'GET',
      headers: getAuthHeaders(false)
    });

    return handleResponse(response, "Failed to fetch upcoming events for shelter");
  } catch (error) {
    console.error('Error fetching upcoming shelter events:', error);
    throw error;
  }
}

/**
 * Fetch user events
 * @param {number} userId - The ID of the user
 * @param {string} status - Optional attendance status filter
 * @returns {Promise<Array>} - Promise that resolves to an array of events
 */
export async function fetchUserEvents(userId, status) {
  try {
    let url = `${API_BASE_URL}/user/${userId}`;
    if (status) {
      url += `?status=${status}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(false)
    });

    return handleResponse(response, "Failed to fetch user events");
  } catch (error) {
    console.error('Error fetching user events:', error);
    throw error;
  }
}

/**
 * Fetch events grouped by shelter
 * @returns {Promise<Array>} - Promise that resolves to an array of events grouped by shelter
 */
export async function fetchEventsGroupedByShelter() {
  try {
    const response = await fetch(`${API_BASE_URL}/shelters-with-events`, {
      method: 'GET',
      headers: getAuthHeaders(false)
    });
    
    return handleResponse(response, "Failed to fetch grouped events");
  } catch (error) {
    console.error('Error fetching events grouped by shelter:', error);
    throw error;
  }
}

/**
 * Update a user's attendance status for an event
 * @param {number} eventId - The ID of the event
 * @param {number} userId - The ID of the user
 * @param {Object} attendanceData - Object containing boolean flags for attendance status
 * @param {boolean} attendanceData.interested - Whether the user is interested
 * @param {boolean} attendanceData.going - Whether the user is going
 * @returns {Promise<Object>} - Promise that resolves to the updated event
 */
export async function updateEventAttendance(eventId, userId, attendanceData) {
  try {
    // Determine the status based on attendanceData
    const status = attendanceData.going 
      ? 'GOING' 
      : (attendanceData.interested 
        ? 'INTERESTED' 
        : 'NONE');

    const response = await fetch(`${API_BASE_URL}/${eventId}/attendance?status=${status}`, {
      method: 'POST',
      headers: getAuthHeaders(false, { 'userId': userId })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update event attendance: ${errorText}`);
    }

    const updatedEventResponse = await fetch(`${API_BASE_URL}/${eventId}`, {
      method: 'GET',
      headers: getAuthHeaders(false, { 'userId': userId })
    });

    return handleResponse(updatedEventResponse, "Failed to fetch updated event");
  } catch (error) {
    console.error('Error updating event attendance:', error);
    throw error;
  }
}

/**
 * Remove a user's attendance status from an event
 * @param {number} eventId - The ID of the event
 * @param {number} userId - The ID of the user
 * @returns {Promise<Object>} - Promise that resolves to the updated event
 */
export async function removeEventAttendance(eventId, userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${eventId}/attendance`, {
      method: 'DELETE',
      headers: getAuthHeaders(false, { 'userId': userId })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to remove event attendance: ${errorText}`);
    }

    const updatedEventResponse = await fetch(`${API_BASE_URL}/${eventId}`, {
      method: 'GET',
      headers: getAuthHeaders(false, { 'userId': userId })
    });

    return handleResponse(updatedEventResponse, "Failed to fetch updated event");
  } catch (error) {
    console.error('Error removing event attendance:', error);
    throw error;
  }
}

export default {
  // Event CRUD operations
  fetchAllEvents,
  fetchShelterEvents,
  createEvent,
  updateEvent,
  partialUpdateEvent,
  deleteEvent,
  
  // Event filtering/viewing
  fetchUpcomingEvents,
  fetchUpcomingEventsForShelter,
  fetchUserEvents,
  fetchEventsGroupedByShelter,
  
  // Attendance management
  updateEventAttendance,
  removeEventAttendance
};