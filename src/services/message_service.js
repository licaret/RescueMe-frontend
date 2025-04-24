import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

let stompClient = null;
let connectedCallback = null;
let disconnectedCallback = null;
let messageCallbacks = [];
let readReceiptCallbacks = [];
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

const API_URL = 'http://localhost:8080/api/v1/messages';

export function connectToChat(userId, onConnected, onDisconnected) {
  connectedCallback = onConnected;
  disconnectedCallback = onDisconnected;
  
  console.log("📡 [Chat] Subscribing to /user/" + userId + "/queue/messages");


  if (stompClient === null || !stompClient.connected) {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    
    // Disable Stomp debug logs
    stompClient.debug = () => {};
    
    stompClient.connect(
      {},
      frame => {
        console.log('Connected to WebSocket: ' + frame);
        
        // Subscribe to user's private message queue
        stompClient.subscribe('/user/' + userId + '/queue/messages', message => {
          const receivedMessage = JSON.parse(message.body);
          messageCallbacks.forEach(callback => callback(receivedMessage));
        });
        
        // Subscribe to read receipts
        stompClient.subscribe('/user/' + userId + '/queue/read-receipts', receipt => {
          const readReceipt = JSON.parse(receipt.body);
          readReceiptCallbacks.forEach(callback => callback(readReceipt));
        });
        
        // Reset reconnect attempts on successful connection
        reconnectAttempts = 0;
        
        if (connectedCallback) {
          connectedCallback();
        }
      },
      error => {
        console.error('STOMP connection error:', error);
        
        if (disconnectedCallback) {
          disconnectedCallback(error);
        }
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          console.log(`Attempting to reconnect in ${delay / 1000} seconds...`);
          
          setTimeout(() => {
            connectToChat(userId, onConnected, onDisconnected);
          }, delay);
        }
      }
    );
  }
}

export function disconnectFromChat() {
  if (stompClient !== null && stompClient.connected) {
    stompClient.disconnect();
    console.log('Disconnected from WebSocket');
    
    if (disconnectedCallback) {
      disconnectedCallback();
    }
  }
}

export function onMessageReceived(callback) {
  messageCallbacks.push(callback);
  return () => {
    // Return a cleanup function to remove the callback
    messageCallbacks = messageCallbacks.filter(cb => cb !== callback);
  };
}

export function onReadReceipt(callback) {
  readReceiptCallbacks.push(callback);
  return () => {
    // Return a cleanup function to remove the callback
    readReceiptCallbacks = readReceiptCallbacks.filter(cb => cb !== callback);
  };
}

export function sendMessage(messageData) {
    return new Promise((resolve, reject) => {
      if (stompClient && stompClient.connected) {
        try {
          stompClient.send('/app/chat.send', JSON.stringify(messageData), {});
          resolve(messageData);
        } catch (e) {
          console.error("❌ Error sending via WebSocket:", e);
          reject(e);
        }
      } else {
        console.warn("⚠️ WebSocket not connected. Falling back to REST API.");
        fetch(`${API_URL}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData)
        })
          .then(response => {
            if (!response.ok) throw new Error('REST send failed');
            return response.json();
          })
          .then(resolve)
          .catch(reject);
      }
    });
  }
  

  export function markConversationAsRead(conversationId, userId) {
    return new Promise((resolve, reject) => {
      if (stompClient && stompClient.connected) {
        try {
          stompClient.send('/app/chat.read', JSON.stringify({ conversationId, userId }), {});
          resolve();
        } catch (e) {
          console.error("❌ Error sending read receipt via WebSocket:", e);
          reject(e);
        }
      } else {
        console.warn("⚠️ WebSocket not connected. Using REST fallback for read receipt.");
        fetch(`${API_URL}/conversation/${conversationId}/read?userId=${userId}`, {
          method: 'POST',
        })
          .then(response => {
            if (!response.ok) throw new Error('REST read receipt failed');
            resolve();
          })
          .catch(reject);
      }
    });
  }
  

export function getConversationMessages(conversationId, userId) {
  return fetch(`${API_URL}/conversation/${conversationId}?userId=${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch conversation messages');
      }
      return response.json();
    });
}

export function getUserConversations(userId) {
  return fetch(`${API_URL}/conversations/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user conversations');
      }
      return response.json();
    });
}

export function getUnreadMessagesCount(userId) {
  return fetch(`${API_URL}/unread/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch unread messages count');
      }
      return response.json();
    });
}

export function getConversationId(user1Id, user2Id) {
  return fetch(`${API_URL}/conversation-id?user1Id=${user1Id}&user2Id=${user2Id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch conversation ID');
      }
      return response.json();
    })
    .then(data => data.conversationId);
}