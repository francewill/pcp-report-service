import { SQSClient } from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';

export const sqsConfigFactory = (configService: ConfigService) => {
  // Create SQS Client for LocalStack
  const sqsClient = new SQSClient({
    region: configService.get<string>('AWS_REGION', 'ca-central-1'),
    endpoint: configService.get<string>('AWS_ENDPOINT', 'http://localhost:4566'),
    credentials: {
      accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID', 'test'),
      secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY', 'test'),
    },
  });

  const queueUrl = configService.get<string>('QUEUE_URL', '');
  const queueName = configService.get<string>('QUEUE_NAME', '');

  return {
    consumers: [
      {
        name: queueName,
        queueUrl: queueUrl,
        sqs: sqsClient,
      },
    ],
    producers: [
      {
        name: queueName,
        queueUrl: queueUrl,
        sqs: sqsClient,
      },
    ],
  };
};
