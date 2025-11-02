import { Injectable } from '@nestjs/common';
import type { Message } from '@aws-sdk/client-sqs';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';

@Injectable()
export class MessageHandlerService {
  @SqsMessageHandler('pcp-tenant-monthly-report', false)
  public async handleMessage(message: Message) {
    const messageBody = message.Body;
    console.log(`hey i received the message, it says "${messageBody}"`);
  }
}
