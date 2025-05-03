import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const connectToMessageSocket = (userId, onMessageCallback) => {
  console.log('Connecting to message WebSocket for userId:', userId);
  
  stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    debug: (str) => {
      console.log('STOMP message debug:', str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    
    onConnect: (frame) => {
      console.log('STOMP message connected:', frame);
      
      stompClient.subscribe(`/topic/messages/${userId}`, (message) => {
        console.log('Received message notification:', message);
        try {
          const messageData = JSON.parse(message.body);
          onMessageCallback(messageData);
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      });
    },
    
    onStompError: (frame) => {
      console.error('STOMP message error:', frame);
    },
    
    onWebSocketClose: (event) => {
      console.log('WebSocket message closed:', event);
    },
    
    onWebSocketError: (event) => {
      console.error('WebSocket message error:', event);
    }
  });

  stompClient.activate();
};

export const disconnectFromMessageSocket = () => {
  if (stompClient && stompClient.active) {
    console.log('Disconnecting from message WebSocket');
    stompClient.deactivate();
  }
};