/*
 * Real-time messaging functionality using WebSockets and REST fallbacks
 */

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_URL = 'http://localhost:8080/api/v1/messages';
const ATTACHMENT_API_URL = 'http://localhost:8080/api/v1/attachments';

// Singleton WebSocket client
let stompClient = null;
let messageCallbacks = [];
let readReceiptCallbacks = [];

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
 * Connect to WebSocket chat for a specific user
 * @param {number} userId - The ID of the user
 * @param {Function} onConnected - Callback when connection is established
 * @param {Function} onDisconnected - Callback when connection is lost or failed
 */
export function connectToChat(userId, onConnected, onDisconnected) {
  if (stompClient && stompClient.active) return;

  console.log("Connecting to chat for user ID:", userId);

  stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: str => console.log('[CHAT DEBUG]', str),

    onConnect: (frame) => {
      console.log('[Chat] Connected:', frame);
      
      // Subscribe to personal message channel
      stompClient.subscribe(`/topic/chat/${userId}`, (msg) => {
        console.log("MESSAGE RECEIVED:", msg);
        try {
          const parsed = JSON.parse(msg.body);
          console.log("PARSED MESSAGE:", parsed);

          // Dispatch a custom event for new messages
          const event = new CustomEvent('new-message', { detail: parsed });
          window.dispatchEvent(event);

          messageCallbacks.forEach(cb => cb(parsed));
        } catch (e) {
          console.error("Error parsing message:", e);
        }
      });
      
      // Subscribe to read receipts channel
      stompClient.subscribe(`/topic/read/${userId}`, (receipt) => {
        console.log("READ RECEIPT RECEIVED:", receipt);
        try {
          const parsed = JSON.parse(receipt.body);
          readReceiptCallbacks.forEach(cb => cb(parsed));
        } catch (e) {
          console.error("Error parsing read receipt:", e);
        }
      });
      
      // Subscribe to system events channel
      stompClient.subscribe(`/topic/system/${userId}`, (event) => {
        console.log("SYSTEM EVENT RECEIVED:", event);
        try {
          const parsed = JSON.parse(event.body);
          
          // Trigger event based on type
          if (parsed.type === 'NEW_CONVERSATION') {
            const refreshEvent = new CustomEvent('refresh-conversations');
            window.dispatchEvent(refreshEvent);
          }
        } catch (e) {
          console.error("Error parsing system event:", e);
        }
      });
      
      onConnected?.();
    },

    onStompError: frame => {
      console.error('[Chat STOMP error]', frame);
      onDisconnected?.(frame);
    },

    onWebSocketClose: event => {
      console.warn('[Chat WS closed]', event);
    },

    onWebSocketError: event => {
      console.error('[Chat WS error]', event);
    }
  });

  stompClient.activate();
}

/**
 * Disconnect from the WebSocket chat
 */
export function disconnectFromChat() {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
    console.log('Disconnected from WebSocket');
  }
}

/**
 * Register a callback for received messages
 * @param {Function} callback - Function to call when a message is received
 * @returns {Function} Unsubscribe function to remove the callback
 */
export function onMessageReceived(callback) {
  console.log("Registering message callback");
  messageCallbacks.push(callback);
  return () => {
    messageCallbacks = messageCallbacks.filter(cb => cb !== callback);
  };
}

/**
 * Register a callback for read receipts
 * @param {Function} callback - Function to call when a read receipt is received
 * @returns {Function} Unsubscribe function to remove the callback
 */
export function onReadReceipt(callback) {
  console.log("Registering read receipt callback");
  readReceiptCallbacks.push(callback);
  return () => {
    readReceiptCallbacks = readReceiptCallbacks.filter(cb => cb !== callback);
  };
}

/**
 * Check if WebSocket is connected
 * @returns {boolean} True if connected, false otherwise
 */
export function isConnected() {
  return stompClient && stompClient.active && stompClient.connected;
}

/**
 * Send a text message
 * @param {Object} messageData - Message data to send
 * @returns {Promise<Object>} The sent message data
 */
export function sendMessage(messageData) {
  return new Promise((resolve, reject) => {
    console.log("Attempting to send message, connection status:", stompClient?.connected);

    if (isConnected()) {
      try {
        console.log("Sending message via WebSocket:", messageData);
        stompClient.publish({
          destination: '/app/chat.send',
          body: JSON.stringify(messageData)
        });
        // Resolve directly with the sent data
        resolve(messageData);
      } catch (err) {
        console.error("WebSocket send error:", err);
        console.log("Falling back to REST API for sending message");
        sendViaRest(messageData, resolve, reject);
      }
    } else {
      console.warn("WebSocket not connected, using REST fallback");
      sendViaRest(messageData, resolve, reject);
    }
  });
}

/**
 * Send a message via REST API (fallback)
 * @param {Object} messageData - Message data to send
 * @param {Function} resolve - Promise resolve function
 * @param {Function} reject - Promise reject function
 */
function sendViaRest(messageData, resolve, reject) {
  fetch(`${API_URL}/send`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(messageData)
  })
  .then(res => {
    if (!res.ok) {
      return Promise.reject(`Failed to send message: ${res.status} ${res.statusText}`);
    }
    return res.json();
  })
  .then(resolve)
  .catch(error => {
    console.error("Error sending message via REST:", error);
    reject(error);
  });
}

/**
 * Send a message with attachments
 * @param {Object} messageData - Message data to send
 * @param {Array<File>} files - Array of files to attach
 * @returns {Promise<Object>} The sent message with attachments
 */
export function sendMessageWithAttachments(messageData, files) {
  return new Promise((resolve, reject) => {
    console.log("Sending message with attachments:", messageData, files);
    
    const formData = new FormData();
    
    // Add message as JSON blob
    const messageBlob = new Blob([JSON.stringify(messageData)], { type: 'application/json' });
    formData.append('message', messageBlob);
    
    // Add files
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    // Add authorization token to form data
    const token = localStorage.getItem('token');
    if (token) {
      formData.append('token', token); 
    }
    
    // Send to server
    fetch(`${API_URL}/send-with-attachments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(`Failed to send message with attachments: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then(resolve)
    .catch(error => {
      console.error("Error sending message with attachments:", error);
      reject(error);
    });
  });
}

/**
 * Mark a conversation as read
 * @param {string} conversationId - The ID of the conversation
 * @param {number} userId - The ID of the user
 * @returns {Promise<void>} Promise that resolves when operation completes
 */
export function markConversationAsRead(conversationId, userId) {
  return new Promise((resolve, reject) => {
    if (isConnected()) {
      try {
        console.log("Marking conversation as read via WebSocket:", conversationId);
        stompClient.publish({
          destination: '/app/chat.read',
          body: JSON.stringify({ conversationId, userId })
        });
        resolve();
      } catch (e) {
        console.error("WebSocket read receipt error:", e);
        markAsReadViaRest(conversationId, userId, resolve, reject);
      }
    } else {
      console.warn("WebSocket not connected, using REST fallback for marking as read");
      markAsReadViaRest(conversationId, userId, resolve, reject);
    }
  });
}

/**
 * Mark a conversation as read via REST API (fallback)
 * @param {string} conversationId - The ID of the conversation
 * @param {number} userId - The ID of the user
 * @param {Function} resolve - Promise resolve function
 * @param {Function} reject - Promise reject function
 */
function markAsReadViaRest(conversationId, userId, resolve, reject) {
  fetch(`${API_URL}/conversation/${conversationId}/read?userId=${userId}`, {
    method: 'POST',
    headers: getAuthHeaders()
  })
  .then(res => res.ok ? resolve() : Promise.reject(`Failed to mark as read: ${res.status} ${res.statusText}`))
  .catch(error => {
    console.error("Error marking conversation as read:", error);
    reject(error);
  });
}

/**
 * Get messages for a conversation
 * @param {string} conversationId - The ID of the conversation
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} Array of messages in the conversation
 */
export function getConversationMessages(conversationId, userId) {
  return fetch(`${API_URL}/conversation/${conversationId}?userId=${userId}`, {
    headers: getAuthHeaders()
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(`Failed to fetch messages: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .catch(error => {
      console.error("Error fetching conversation messages:", error);
      throw error;
    });
}

/**
 * Get all conversations for a user
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} Array of conversation objects
 */
export function getUserConversations(userId) {
  return fetch(`${API_URL}/conversations/${userId}`, {
    headers: getAuthHeaders()
  })
    .then(res => {
      if (!res.ok) {
        console.error(`Failed to fetch conversations: ${res.status} ${res.statusText}`);
        return [];
      }
      return res.json();
    })
    .then(conversations => {
      const conversationsWithPromises = conversations.map(async conversation => {
        if (!conversation.participantProfilePicture && conversation.participantId) {
          try {
            // Try to get profile picture for this participant
            const response = await fetch(`http://localhost:8080/users/${conversation.participantId}/profilePicture`, {
              headers: getAuthHeaders()
            });
            if (response.ok) {
              const blob = await response.blob();
              const base64data = await blobToBase64(blob);
              // Remove data:image prefix
              const base64Clean = base64data.split(',')[1] || base64data;
              conversation.participantProfilePicture = base64Clean;
            }
          } catch (e) {
            console.warn(`Could not fetch profile picture for user ${conversation.participantId}:`, e);
          }
        }
        return conversation;
      });
      
      return Promise.all(conversationsWithPromises);
    })
    .catch(error => {
      console.error("Error fetching conversations:", error);
      return [];
    });
}

/**
 * Helper function to convert Blob to Base64
 * @param {Blob} blob - The binary blob to convert
 * @returns {Promise<string>} Base64 encoded string
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Get the count of unread messages for a user
 * @param {number} userId - The ID of the user
 * @returns {Promise<number>} The count of unread messages
 */
export function getUnreadMessagesCount(userId) {
  return fetch(`${API_URL}/unread/${userId}`, {
    headers: getAuthHeaders()
  })
    .then(res => {
      if (!res.ok) {
        console.error(`Failed to fetch unread count: ${res.status} ${res.statusText}`);
        return 0; 
      }
      return res.json();
    })
    .catch(error => {
      console.error("Error fetching unread count:", error);
      return 0; 
    });
}

/**
 * Get the conversation ID for two users
 * @param {number} user1Id - The ID of the first user
 * @param {number} user2Id - The ID of the second user
 * @returns {Promise<string>} The conversation ID
 */
export function getConversationId(user1Id, user2Id) {
  return fetch(`${API_URL}/conversation-id?user1Id=${user1Id}&user2Id=${user2Id}`, {
    headers: getAuthHeaders()
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(`Failed to fetch conversation ID: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => data.conversationId)
    .catch(error => {
      console.error("Error fetching conversation ID:", error);
      throw error;
    });
}


// === ATTACHMENT FUNCTIONS ===

/**
 * Get information about an attachment
 * @param {number|string} attachmentId - The ID of the attachment
 * @returns {Promise<Object>} Attachment information
 */
export function getAttachmentInfo(attachmentId) {
  if (typeof attachmentId === 'string' && attachmentId.startsWith('temp-')) {
    return Promise.resolve({});
  }
  
  return fetch(`${ATTACHMENT_API_URL}/${attachmentId}/info`, {
    headers: getAuthHeaders()
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(`Failed to fetch attachment info: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .catch(error => {
      console.error("Error fetching attachment info:", error);
      throw error;
    });
}

/**
 * Get download URL for an attachment
 * @param {number|string} attachmentId - The ID of the attachment
 * @returns {string|null} URL for downloading the attachment or null for temporary IDs
 */
export function getAttachmentDownloadUrl(attachmentId) {
  if (typeof attachmentId === 'string' && attachmentId.startsWith('temp-')) {
    return null;
  }
  
  const token = localStorage.getItem('token');
  return `${ATTACHMENT_API_URL}/${attachmentId}/download?token=${token}&t=${Date.now()}`;
}
/**
 * Get thumbnail URL for an attachment
 * @param {number|string} attachmentId - The ID of the attachment
 * @returns {string|null} URL for the attachment thumbnail or null for temporary IDs
 */
export function getAttachmentThumbnailUrl(attachmentId) {
  if (typeof attachmentId === 'string' && attachmentId.startsWith('temp-')) {
    return null;
  }
  
  const token = localStorage.getItem('token');
  return `${ATTACHMENT_API_URL}/${attachmentId}/thumbnail?token=${token}&t=${Date.now()}`;
}

/**
 * Delete an attachment
 * @param {number|string} attachmentId - The ID of the attachment
 * @returns {Promise<boolean>} True if deletion was successful
 */
export function deleteAttachment(attachmentId) {
  if (typeof attachmentId === 'string' && attachmentId.startsWith('temp-')) {
    return Promise.resolve(true);
  }
  
  return fetch(`${ATTACHMENT_API_URL}/${attachmentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  .then(res => {
    if (!res.ok) {
      return Promise.reject(`Failed to delete attachment: ${res.status} ${res.statusText}`);
    }
    return true;
  })
  .catch(error => {
    console.error("Error deleting attachment:", error);
    throw error;
  });
}

/**
 * Check if an attachment ID is temporary
 * @param {number|string} attachmentId - The ID to check
 * @returns {boolean} True if the ID is temporary
 */
export function isTemporaryAttachmentId(attachmentId) {
  return typeof attachmentId === 'string' && attachmentId.startsWith('temp-');
}