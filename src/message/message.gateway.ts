import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { subscribe } from 'diagnostics_channel';
import { Server, Socket } from 'socket.io';

interface client {
  userId: string;
  socketId: string;
}
@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  private clients: client[] = [];

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients = this.clients.filter((c) => c.socketId !== client.id);
    this.server.emit('GetOnlineUser', this.clients);
  }

  @SubscribeMessage('userOnline')
  handleUserOnline(client: any, payload: any) {
    console.log(payload);
    this.clients.push(payload);
    this.server.emit('GetOnlineUser', this.clients);
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, payload: any) {
    this.server.emit('typingIndicator', payload);
  }
  @SubscribeMessage('stopTyping')
  handleStopTyping(client: Socket, payload: any) { 
    this.server.emit('typingIndicator', payload);
  }
}

// @SubscribeMessage('userOffline')
// handleUserOffline(client: any, payload: any) {
//   this.clients = this.clients.filter(
//     (item) => item.socketId !== payload.socketId,
//   );
//   console.log(payload);
//   this.server.emit('GetOnlineUser', this.clients);
// }
