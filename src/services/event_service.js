// src/services/event_service.js

const API_BASE_URL = 'http://localhost:8080/api/v1/events';

/**
 * Fetch all events
 * @returns {Promise<Array>} - Promise that resolves to an array of all events
 */
// In event_service.js
export async function fetchAllEvents() {
  try {
    const userId = localStorage.getItem("Id");
    
    // If no user ID is available, user might not be logged in
    if (!userId) {
      console.warn("No user ID found in localStorage. User might not be logged in.");
    }
    
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'userId': userId // Always send the userId header if available
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch events: ${errorText}`);
    }

    return await response.json();
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
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch shelter events: ${errorText}`);
    }

    return await response.json();
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
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'shelterId': shelterId
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create event: ${errorText}`);
    }

    return await response.json();
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
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'shelterId': shelterId
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update event: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating event:', error);
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
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'shelterId': shelterId
      }
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
    const response = await fetch(`${API_BASE_URL}/upcoming`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...(userId && { 'userId': userId })
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch upcoming events: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
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
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch user events: ${errorText}`);
    }

    return await response.json();
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
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch grouped events');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching events grouped by shelter:', error);
    throw error;
  }
}

// export async function updateEventAttendance(eventId, userId, attendanceData) {
//   try {
//     // Determine the status based on attendanceData
//     const status = attendanceData.going 
//       ? 'GOING' 
//       : (attendanceData.interested 
//         ? 'INTERESTED' 
//         : 'NONE');

//     const response = await fetch(`${API_BASE_URL}/${eventId}/attendance?status=${status}`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'userId': userId,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to update event attendance: ${errorText}`);
//     }

//     // Fetch the updated event details with the user's attendance status
//     const updatedEventResponse = await fetch(`${API_BASE_URL}/${eventId}`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'userId': userId  // Make sure to include userId here
//       }
//     });

//     if (!updatedEventResponse.ok) {
//       const errorText = await updatedEventResponse.text();
//       throw new Error(`Failed to fetch updated event: ${errorText}`);
//     }

//     return await updatedEventResponse.json();
//   } catch (error) {
//     console.error('Error updating event attendance:', error);
//     throw error;
//   }
// }

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
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'userId': userId,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update event attendance: ${errorText}`);
    }

    // Fetch the updated event details with the user's attendance status
    const updatedEventResponse = await fetch(`${API_BASE_URL}/${eventId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'userId': userId  // Make sure to include userId here
      }
    });

    if (!updatedEventResponse.ok) {
      const errorText = await updatedEventResponse.text();
      throw new Error(`Failed to fetch updated event: ${errorText}`);
    }

    return await updatedEventResponse.json();
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
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'userId': userId
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to remove event attendance: ${errorText}`);
    }

    const updatedEventResponse = await fetch(`${API_BASE_URL}/${eventId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'userId': userId
      }
    });

    if (!updatedEventResponse.ok) {
      const errorText = await updatedEventResponse.text();
      throw new Error(`Failed to fetch updated event: ${errorText}`);
    }

    return await updatedEventResponse.json();
  } catch (error) {
    console.error('Error removing event attendance:', error);
    throw error;
  }
}

// Export all functions
export default {
  fetchAllEvents,
  fetchShelterEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventAttendance,
  removeEventAttendance,
  fetchUpcomingEvents,
  fetchUserEvents,
  fetchEventsGroupedByShelter
};