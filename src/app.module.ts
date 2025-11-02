import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SqsModule } from '@ssut/nestjs-sqs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { sqsConfigFactory } from './config/sqs.config';
import { MessageHandlerService } from './message-handler/message-handler.service';
import { ConsumerModule } from './consumer/consumer.module';
import { PublisherModule } from './publisher/publisher.module';
import CommonModule from './common/common.module';
// import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    SqsModule.registerAsync({
      imports: [ConfigModule],
      useFactory: sqsConfigFactory,
      inject: [ConfigService],
    }),
    
    CommonModule,
    // DatabaseModule,
    ConsumerModule,
    PublisherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
