import { Body, Controller, Post, Get, Param, UseGuards } from '@nestjs/common';

import { Message } from 'src/schemas/message.schema';
import { MessageService } from './message.service';
import { MessageDto } from 'src/dto/message.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  // @UseGuards(AuthGuard) // Apply the guard to this route
  @Post()
  async sendMessage(@Body() messageDto: MessageDto): Promise<Message> {
    return this.messageService.sendMessage(messageDto);
  }
  @UseGuards(AuthGuard) // Apply the guard to this route
  @Get(':sender/:receiver')
  async getMessages(
    @Param('sender') sender: string,
    @Param('receiver') receiver: string,
  ): Promise<Message[]> {
    return this.messageService.getMessagesForUser(sender, receiver);
  }
}
