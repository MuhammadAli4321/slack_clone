// message.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDto } from 'src/dto/message.dto';
import { Message } from 'src/schemas/message.schema';
import { MessageGateway } from './message.gateway'; // Import the WebSocket gateway

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly messageGateway: MessageGateway, // Inject the WebSocket gateway
  ) {}

  async sendMessage(messageDto: MessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(messageDto);
    const savedMessage = await createdMessage.save();

    // // Emit the message to the receiver
    this.messageGateway.server.emit('receiveMessage', savedMessage);

    return savedMessage;
  }

  async getMessagesForUser(
    sender: string,
    receiver: string,
  ): Promise<Message[]> {
    return this.messageModel
      .find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      })
      .exec();
  }
}
