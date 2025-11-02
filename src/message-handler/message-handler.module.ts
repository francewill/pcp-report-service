import { Module } from '@nestjs/common';
import { MessageHandlerService } from './message-handler.service';

@Module({
  providers: [MessageHandlerService],
})
export class MessageHandlerModule {}
