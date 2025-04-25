import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_URL = 'http://localhost:8080/api/v1/messages';

let stompClient = null;
let connectedCallback = null;
let disconnectedCallback = null;
let messageCallbacks = [];
let readReceiptCallbacks = [];

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export function connectToChat(userId, onConnected, onDisconnected) {
    if (stompClient && stompClient.active) return;

    stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: str => console.log('[CHAT DEBUG]', str),
      
      onConnect: (frame) => {
        console.log('✅ [Chat] Connected:', frame);
        
        // Subscrie la mesaje și adaugă MULTE loguri
        stompClient.subscribe(`/user/${userId}/queue/messages`, (msg) => {
          console.log("🔔🔔🔔 MESSAGE ARRIVED:", msg);
          console.log("🔔 MESSAGE CONTENT:", msg.body);
          
          try {
            const parsed = JSON.parse(msg.body);
            console.log("📦 PARSED MESSAGE:", parsed);
            console.log("📦 Callbacks count:", messageCallbacks.length);
            
            if (messageCallbacks.length > 0) {
              messageCallbacks.forEach(cb => {
                try {
                  console.log("📞 Executing callback");
                  cb(parsed);
                } catch (e) {
                  console.error("❌ Error executing callback:", e);
                }
              });
            } else {
              console.warn("⚠️ No callbacks registered to handle messages!");
            }
          } catch (e) {
            console.error("❌ Error parsing message:", e);
          }
        });
        stompClient.subscribe(`/user/${userId}/queue/read-receipts`, (receipt) => {
            const parsed = JSON.parse(receipt.body);
            readReceiptCallbacks.forEach(cb => cb(parsed));
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

export function disconnectFromChat() {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
    console.log('Disconnected from WebSocket');
    window.existingChatConnection = false;
    if (disconnectedCallback) disconnectedCallback();
  }
}

export function onMessageReceived(callback) {
  console.log("Registering message callback", callback);
  
  // Verifică dacă callback-ul există deja pentru a evita duplicate
  const exists = messageCallbacks.some(cb => cb.toString() === callback.toString());
  
  if (!exists) {
    messageCallbacks.push(callback);
    console.log("Callback registered. Total callbacks:", messageCallbacks.length);
  } else {
    console.log("Callback already registered");
  }
  
  return () => {
    console.log("Removing message callback");
    messageCallbacks = messageCallbacks.filter(cb => cb !== callback);
    console.log("Callbacks remaining:", messageCallbacks.length);
  };
}

export function onReadReceipt(callback) {
  console.log("Registering read receipt callback", callback);
  readReceiptCallbacks.push(callback);
  return () => {
    readReceiptCallbacks = readReceiptCallbacks.filter(cb => cb !== callback);
  };
}

export function isConnected() {
  return stompClient && stompClient.active && stompClient.connected;
}

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

function sendViaRest(messageData, resolve, reject) {
  fetch(`${API_URL}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData)
  })
  .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
  .then(resolve)
  .catch(reject);
}

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

function markAsReadViaRest(conversationId, userId, resolve, reject) {
  fetch(`${API_URL}/conversation/${conversationId}/read?userId=${userId}`, {
    method: 'POST'
  })
  .then(res => res.ok ? resolve() : Promise.reject(res.statusText))
  .catch(reject);
}

export function getConversationMessages(conversationId, userId) {
  return fetch(`${API_URL}/conversation/${conversationId}?userId=${userId}`)
    .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch messages'));
}

export function getUserConversations(userId) {
  return fetch(`${API_URL}/conversations/${userId}`)
    .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch conversations'));
}

export function getUnreadMessagesCount(userId) {
  return fetch(`${API_URL}/unread/${userId}`)
    .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch unread count'));
}

export function getConversationId(user1Id, user2Id) {
  return fetch(`${API_URL}/conversation-id?user1Id=${user1Id}&user2Id=${user2Id}`)
    .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch conversation ID'))
    .then(data => data.conversationId);
}