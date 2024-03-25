// message.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: Socket, message: any): void {
    // Emit the message to the receiver
    this.server.to(message.receiver).emit('receiveMessage', message);
  }
}
