import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_URL = 'http://localhost:8080/api/v1/messages';
const ATTACHMENT_API_URL = 'http://localhost:8080/api/v1/attachments';

let stompClient = null;
let messageCallbacks = [];
let readReceiptCallbacks = [];

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
      
      // Folosim topic în loc de user queue
      stompClient.subscribe(`/topic/chat/${userId}`, (msg) => {
        console.log("🔔 MESSAGE RECEIVED:", msg);
        try {
          const parsed = JSON.parse(msg.body);
          console.log("📦 PARSED MESSAGE:", parsed);
          messageCallbacks.forEach(cb => cb(parsed));
        } catch (e) {
          console.error("❌ Error parsing message:", e);
        }
      });
      
      // Folosim topic în loc de user queue pentru read receipts
      stompClient.subscribe(`/topic/read/${userId}`, (receipt) => {
        console.log("📬 READ RECEIPT RECEIVED:", receipt);
        try {
          const parsed = JSON.parse(receipt.body);
          readReceiptCallbacks.forEach(cb => cb(parsed));
        } catch (e) {
          console.error("❌ Error parsing read receipt:", e);
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

export function disconnectFromChat() {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
    console.log('Disconnected from WebSocket');
  }
}

export function onMessageReceived(callback) {
  console.log("Registering message callback");
  messageCallbacks.push(callback);
  return () => {
    messageCallbacks = messageCallbacks.filter(cb => cb !== callback);
  };
}

export function onReadReceipt(callback) {
  console.log("Registering read receipt callback");
  readReceiptCallbacks.push(callback);
  return () => {
    readReceiptCallbacks = readReceiptCallbacks.filter(cb => cb !== callback);
  };
}

export function isConnected() {
  return stompClient && stompClient.active && stompClient.connected;
}

// Trimite mesaj text simplu
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

// Trimite mesaj cu atașamente
export function sendMessageWithAttachments(messageData, files) {
  return new Promise((resolve, reject) => {
    console.log("Sending message with attachments:", messageData, files);
    
    const formData = new FormData();
    
    // Adăugăm mesajul ca JSON
    const messageBlob = new Blob([JSON.stringify(messageData)], { type: 'application/json' });
    formData.append('message', messageBlob);
    
    // Adăugăm fișierele
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    // Trimitem la server
    fetch(`${API_URL}/send-with-attachments`, {
      method: 'POST',
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
  .then(res => res.ok ? resolve() : Promise.reject(`Failed to mark as read: ${res.status} ${res.statusText}`))
  .catch(error => {
    console.error("Error marking conversation as read:", error);
    reject(error);
  });
}

export function getConversationMessages(conversationId, userId) {
  return fetch(`${API_URL}/conversation/${conversationId}?userId=${userId}`)
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

export function getUserConversations(userId) {
  return fetch(`${API_URL}/conversations/${userId}`)
    .then(res => {
      if (!res.ok) {
        console.error(`Failed to fetch conversations: ${res.status} ${res.statusText}`);
        // Returnează o listă goală în loc să întrerupă fluxul aplicației
        return [];
      }
      return res.json();
    })
    .catch(error => {
      console.error("Error fetching conversations:", error);
      // Returnează o listă goală în caz de eroare
      return [];
    });
}

export function getUnreadMessagesCount(userId) {
  return fetch(`${API_URL}/unread/${userId}`)
    .then(res => {
      if (!res.ok) {
        console.error(`Failed to fetch unread count: ${res.status} ${res.statusText}`);
        return 0; // Valoare implicită în caz de eroare
      }
      return res.json();
    })
    .catch(error => {
      console.error("Error fetching unread count:", error);
      return 0; // Valoare implicită în caz de eroare
    });
}

export function getConversationId(user1Id, user2Id) {
  return fetch(`${API_URL}/conversation-id?user1Id=${user1Id}&user2Id=${user2Id}`)
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

// Funcții noi pentru atașamente

// Obține informații despre un atașament
export function getAttachmentInfo(attachmentId) {
  // Verifică dacă ID-ul este temporar
  if (typeof attachmentId === 'string' && attachmentId.startsWith('temp-')) {
    // Pentru ID-uri temporare, returnăm o promisiune cu un obiect gol
    return Promise.resolve({});
  }
  
  return fetch(`${ATTACHMENT_API_URL}/${attachmentId}/info`)
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

// Obține URL-ul pentru descărcarea unui atașament
export function getAttachmentDownloadUrl(attachmentId) {
  // Verifică dacă ID-ul este temporar
  if (typeof attachmentId === 'string' && attachmentId.startsWith('temp-')) {
    // Pentru ID-uri temporare, returnăm null
    return null;
  }
  return `${ATTACHMENT_API_URL}/${attachmentId}/download`;
}

// Obține URL-ul pentru miniatura unui atașament
export function getAttachmentThumbnailUrl(attachmentId) {
  // Verifică dacă ID-ul este temporar
  if (typeof attachmentId === 'string' && attachmentId.startsWith('temp-')) {
    // Pentru ID-uri temporare, returnăm null
    return null;
  }
  return `${ATTACHMENT_API_URL}/${attachmentId}/thumbnail`;
}

// Șterge un atașament
export function deleteAttachment(attachmentId) {
  // Verifică dacă ID-ul este temporar
  if (typeof attachmentId === 'string' && attachmentId.startsWith('temp-')) {
    // Pentru ID-uri temporare, nu facem nimic
    return Promise.resolve(true);
  }
  
  return fetch(`${ATTACHMENT_API_URL}/${attachmentId}`, {
    method: 'DELETE'
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

// Verifică dacă un ID de atașament este temporar
export function isTemporaryAttachmentId(attachmentId) {
  return typeof attachmentId === 'string' && attachmentId.startsWith('temp-');
}