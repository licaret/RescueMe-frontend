import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const connectToNotifications = (shelterId, onMessageCallback) => {
  console.log('Connecting to WebSocket for shelterId:', shelterId);
  
  stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    debug: (str) => {
      console.log('STOMP debug:', str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    
    onConnect: (frame) => {
      console.log('STOMP connected:', frame);
      
      stompClient.subscribe(`/topic/shelter/${shelterId}`, (message) => {
        console.log('Received message:', message);
        try {
          const notification = JSON.parse(message.body);
          onMessageCallback(notification);
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      });
    },
    
    onStompError: (frame) => {
      console.error('STOMP error:', frame);
    },
    
    onWebSocketClose: (event) => {
      console.log('WebSocket closed:', event);
    },
    
    onWebSocketError: (event) => {
      console.error('WebSocket error:', event);
    }
  });

  stompClient.activate();
};

export const disconnectFromNotifications = () => {
  if (stompClient && stompClient.active) {
    console.log('Disconnecting from WebSocket');
    stompClient.deactivate();
  }
};