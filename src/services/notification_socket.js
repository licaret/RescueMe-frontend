import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let activeSubscriptions = [];

/**
 * Configure and get a STOMP client
 * @param {string} userType - Type of user ('shelter' or 'adopter')
 * @returns {Client} Configured STOMP client instance
 */
const getStompClient = (userType) => {
  if (!stompClient || !stompClient.active) {
    stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      
      debug: (str) => {
        console.log(`STOMP ${userType} debug:`, str);
      },
      
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      onStompError: (frame) => {
        console.error(`STOMP ${userType} error:`, frame);
      },
      
      onWebSocketClose: (event) => {
        console.log(`WebSocket ${userType} closed:`, event);
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
  
  const subscribeToShelterTopic = () => {
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
    
    subscription = client.subscribe(`/topic/shelter/${shelterId}`, (message) => {
      console.log('Received shelter notification:', message);
      try {
        const notification = JSON.parse(message.body);
        onMessageCallback(notification);
      } catch (e) {
        console.error('Error parsing shelter notification:', e);
      }
    });
    
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
  
  if (client.connected) {
    subscribeToShelterTopic();
  } else {
    client.onConnect = (frame) => {
      console.log('STOMP connected for shelter:', frame);
      subscribeToShelterTopic();
    };
    
    if (!client.active) {
      client.activate();
    }
  }
  
  return () => {
    if (subscription) {
      try {
        subscription.unsubscribe();
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
  
  const subscribeToAdopterTopic = () => {
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
    
    subscription = client.subscribe(`/topic/adopter/${adopterId}`, (message) => {
      console.log('Received adopter notification:', message);
      try {
        const notification = JSON.parse(message.body);
        onMessageCallback(notification);
      } catch (e) {
        console.error('Error parsing adopter notification:', e);
      }
    });
    
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
  
  if (client.connected) {
    subscribeToAdopterTopic();
  } else {
    client.onConnect = (frame) => {
      console.log('STOMP connected for adopter:', frame);
      subscribeToAdopterTopic();
    };
    
    if (!client.active) {
      client.activate();
    }
  }
  
  return () => {
    if (subscription) {
      try {
        subscription.unsubscribe();
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
    
    activeSubscriptions.forEach(sub => {
      if (sub.subscription) {
        try {
          sub.subscription.unsubscribe();
        } catch (e) {
          console.warn(`Error unsubscribing from ${sub.id}:`, e);
        }
      }
    });
    
    activeSubscriptions = [];
    
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