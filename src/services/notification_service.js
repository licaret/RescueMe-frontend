const BASE_URL = 'http://localhost:8080';

export const fetchShelterNotifications = async (shelterId) => {
  const response = await fetch(`${BASE_URL}/api/notifications/shelter/${shelterId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch shelter notifications');
  }
  return await response.json();
};

export const fetchAdopterNotifications = async (adopterId) => {
  const response = await fetch(`${BASE_URL}/api/notifications/adopter/${adopterId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch adopter notifications');
  }
  return await response.json();
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}/mark-read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }
};
