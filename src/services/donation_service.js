/*
 * To test webhooks locally, run: stripe listen --forward-to localhost:8080/api/v1/donations/webhook
 */

const API_URL = 'http://localhost:8080/api/v1/donations';

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
 * Creates a donation payment intent through Stripe
 * @param {Object} donationData - Data for the donation (amount, shelterId, etc.)
 * @returns {Promise<Object>} Response containing the Stripe client secret
 */
export async function createDonationIntent(donationData) {
  try {
    const response = await fetch(`${API_URL}/create-intent`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(donationData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create donation intent: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating donation intent:', error);
    throw error;
  }
}

/**
 * Gets the list of donations made to a specific shelter
 * @param {number} shelterId - The ID of the shelter
 * @returns {Promise<Array>} List of donation records for the shelter
 */
export async function getDonationsForShelter(shelterId) {
  try {
    const response = await fetch(`${API_URL}/shelter/${shelterId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shelter donations: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching shelter donations:', error);
    throw error;
  }
}

/**
 * Gets the list of donations made by a specific user
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} List of donation records for the user
 */
export async function getDonationsForUser(userId) {
  try {
    const response = await fetch(`${API_URL}/user/${userId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user donations: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user donations:', error);
    throw error;
  }
}

/**
 * Gets donation statistics for a specific shelter
 * @param {number} shelterId - The ID of the shelter
 * @returns {Promise<Object>} Statistics object with counts and totals
 */
export async function getDonationStatistics(shelterId) {
  try {
    const response = await fetch(`${API_URL}/statistics/${shelterId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch donation statistics: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching donation statistics:', error);
    return {
      totalDonations: 0,
      totalAmountRaised: 0,
      recentDonations: []
    };
  }
}

export default {
  createDonationIntent,
  getDonationsForShelter,
  getDonationsForUser,
  getDonationStatistics,
};