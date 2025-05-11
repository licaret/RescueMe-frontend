  export async function createDonationIntent(donationData) {
    try {
      const response = await fetch('http://localhost:8080/api/v1/donations/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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
  
  export async function getDonationsForShelter(shelterId) {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/donations/shelter/${shelterId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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
  
  export async function getDonationsForUser(userId) {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/donations/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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
  
  export async function getDonationStatistics(shelterId) {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/donations/statistics/${shelterId}`);
      
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