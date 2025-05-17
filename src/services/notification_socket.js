/*
 * Service for connecting to WebSocket to receive real-time notifications
 * Handles both shelter and adopter notification subscriptions
 */

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Singleton WebSocket client instance
let stompClient = null;
let activeSubscriptions = [];

/**
 * Configure and get a STOMP client
 * @param {string} userType - Type of user ('shelter' or 'adopter')
 * @returns {Client} Configured STOMP client instance
 */
const getStompClient = (userType) => {
  // Create a new client if one doesn't exist or if the existing one is not active
  if (!stompClient || !stompClient.active) {
    stompClient = new Client({
      // Create WebSocket connection using SockJS
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      
      debug: (str) => {
        console.log(`STOMP ${userType} debug:`, str);
      },
      
      // Reconnection settings
      reconnectDelay: 5000,
      
      // Heartbeat settings to keep connection alive
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      // Error handlers
      onStompError: (frame) => {
        console.error(`STOMP ${userType} error:`, frame);
      },
      
      onWebSocketClose: (event) => {
        console.log(`WebSocket ${userType} closed:`, event);
        // Clear subscriptions when connection closes
        activeSubscriptions = [];
      },
      
      onWebSocketError: (event) => {
        console.error(`WebSocket ${userType} error:`, event);
      }
    });
  }
  
  return stompClient;
};

/**
 * Connect to shelter notifications
 * @param {number|string} shelterId - ID of the shelter to receive notifications for
 * @param {Function} onMessageCallback - Function to call when a notification is received
 * @returns {Function} Function to call to unsubscribe from notifications
 */
export const connectToShelterNotifications = (shelterId, onMessageCallback) => {
  console.log('Connecting to WebSocket for shelterId:', shelterId);
  
  const client = getStompClient('shelter');
  let subscription = null;
  
  // Define the subscription function that will be executed when connected
  const subscribeToShelterTopic = () => {
    // Unsubscribe from any existing subscription for this shelter
    const existingSub = activeSubscriptions.find(sub => 
      sub.id === `shelter-${shelterId}` && sub.subscription
    );
    
    if (existingSub && existingSub.subscription) {
      try {
        existingSub.subscription.unsubscribe();
      } catch (e) {
        console.warn('Error unsubscribing from existing subscription:', e);
      }
    }
    
    // Create a new subscription
    subscription = client.subscribe(`/topic/shelter/${shelterId}`, (message) => {
      console.log('Received shelter notification:', message);
      try {
        const notification = JSON.parse(message.body);
        onMessageCallback(notification);
      } catch (e) {
        console.error('Error parsing shelter notification:', e);
      }
    });
    
    // Store subscription in the active subscriptions array
    const subIndex = activeSubscriptions.findIndex(sub => sub.id === `shelter-${shelterId}`);
    if (subIndex >= 0) {
      activeSubscriptions[subIndex].subscription = subscription;
    } else {
      activeSubscriptions.push({
        id: `shelter-${shelterId}`,
        type: 'shelter',
        entityId: shelterId,
        subscription
      });
    }
    
    console.log('Successfully subscribed to shelter notifications');
  };
  
  // If client is already connected, subscribe immediately
  if (client.connected) {
    subscribeToShelterTopic();
  } else {
    // Otherwise, subscribe when connection is established
    client.onConnect = (frame) => {
      console.log('STOMP connected for shelter:', frame);
      subscribeToShelterTopic();
    };
    
    // Activate the connection if it's not already active
    if (!client.active) {
      client.activate();
    }
  }
  
  // Return a function to unsubscribe
  return () => {
    if (subscription) {
      try {
        subscription.unsubscribe();
        // Remove from active subscriptions
        activeSubscriptions = activeSubscriptions.filter(sub => 
          sub.id !== `shelter-${shelterId}`
        );
        console.log(`Unsubscribed from shelter ${shelterId} notifications`);
      } catch (e) {
        console.error('Error unsubscribing from shelter notifications:', e);
      }
    }
  };
};

/**
 * Connect to adopter notifications
 * @param {number|string} adopterId - ID of the adopter to receive notifications for
 * @param {Function} onMessageCallback - Function to call when a notification is received
 * @returns {Function} Function to call to unsubscribe from notifications
 */
export const connectToAdopterNotifications = (adopterId, onMessageCallback) => {
  console.log('Connecting to WebSocket for adopterId:', adopterId);
  
  const client = getStompClient('adopter');
  let subscription = null;
  
  // Define the subscription function that will be executed when connected
  const subscribeToAdopterTopic = () => {
    // Unsubscribe from any existing subscription for this adopter
    const existingSub = activeSubscriptions.find(sub => 
      sub.id === `adopter-${adopterId}` && sub.subscription
    );
    
    if (existingSub && existingSub.subscription) {
      try {
        existingSub.subscription.unsubscribe();
      } catch (e) {
        console.warn('Error unsubscribing from existing subscription:', e);
      }
    }
    
    // Create a new subscription
    subscription = client.subscribe(`/topic/adopter/${adopterId}`, (message) => {
      console.log('Received adopter notification:', message);
      try {
        const notification = JSON.parse(message.body);
        onMessageCallback(notification);
      } catch (e) {
        console.error('Error parsing adopter notification:', e);
      }
    });
    
    // Store subscription in the active subscriptions array
    const subIndex = activeSubscriptions.findIndex(sub => sub.id === `adopter-${adopterId}`);
    if (subIndex >= 0) {
      activeSubscriptions[subIndex].subscription = subscription;
    } else {
      activeSubscriptions.push({
        id: `adopter-${adopterId}`,
        type: 'adopter',
        entityId: adopterId,
        subscription
      });
    }
    
    console.log('Successfully subscribed to adopter notifications');
  };
  
  // If client is already connected, subscribe immediately
  if (client.connected) {
    subscribeToAdopterTopic();
  } else {
    // Otherwise, subscribe when connection is established
    client.onConnect = (frame) => {
      console.log('STOMP connected for adopter:', frame);
      subscribeToAdopterTopic();
    };
    
    // Activate the connection if it's not already active
    if (!client.active) {
      client.activate();
    }
  }
  
  // Return a function to unsubscribe
  return () => {
    if (subscription) {
      try {
        subscription.unsubscribe();
        // Remove from active subscriptions
        activeSubscriptions = activeSubscriptions.filter(sub => 
          sub.id !== `adopter-${adopterId}`
        );
        console.log(`Unsubscribed from adopter ${adopterId} notifications`);
      } catch (e) {
        console.error('Error unsubscribing from adopter notifications:', e);
      }
    }
  };
};

/*
 * Disconnect from all notification WebSockets
 * Should be called when component unmounts or user logs out
 */
export const disconnectFromNotifications = () => {
  if (stompClient && stompClient.active) {
    console.log('Disconnecting from WebSocket, unsubscribing from all subscriptions');
    
    // Unsubscribe from all active subscriptions
    activeSubscriptions.forEach(sub => {
      if (sub.subscription) {
        try {
          sub.subscription.unsubscribe();
        } catch (e) {
          console.warn(`Error unsubscribing from ${sub.id}:`, e);
        }
      }
    });
    
    // Clear subscriptions array
    activeSubscriptions = [];
    
    // Deactivate client
    stompClient.deactivate();
    stompClient = null;
  }
};

/**
 * Get a list of all active subscriptions
 * @returns {Array} Array of subscription objects
 */
export const getActiveSubscriptions = () => {
  return [...activeSubscriptions];
};

/**
 * Check if websocket is connected
 * @returns {boolean} True if connected, false otherwise
 */
export const isConnected = () => {
  return stompClient && stompClient.active && stompClient.connected;
};