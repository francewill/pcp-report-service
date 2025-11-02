import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

@Injectable()
export default class S3Service {
  s3Bucket = process.env.PCP_BUCKET_NAME;
  staticUrl = process.env.STATIC_URL ? process.env.STATIC_URL : '';
  awsRegion = process.env.AWS_REGION || 'ca-central-1';

  s3Client = new S3Client({
    ...(process.env.MODE === 'local'
      ? {
          forcePathStyle: true, // Required for MinIO
          endpoint: 'http://localhost:9000',
          credentials: {
            accessKeyId: 'minioadmin',
            secretAccessKey: 'minioadmin',
          },
        }
      : {
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
          },
        }),
    region: this.awsRegion,
  });

  // Upload a file to S3/MinIO
  async uploadFile(buffer: Buffer, mimetype: string, key: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.PCP_BUCKET_NAME,
        Key: key,
        ContentType: mimetype,
        Body: buffer,
      });
      const response = await this.s3Client.send(command);
      return response;
    } catch (caught) {
      if (
        caught instanceof S3ServiceException &&
        caught.name === 'EntityTooLarge'
      ) {
        console.error(
          `Error from S3 while uploading object to ${this.s3Bucket}. The object was too large`,
        );
      } else if (caught instanceof S3ServiceException) {
        console.error(
          `Error from S3 while uploading object to ${this.s3Bucket}. ${caught.name}: ${caught.message}`,
        );
      } else {
        throw caught;
      }
    }
  }

  // Generate a presigned URL for downloading a file
  async getPresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.PCP_BUCKET_NAME,
      Key: key,
    });

    let presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    }); // 1-hour expiry

    if (process.env.MODE === 'local')
      presignedUrl = presignedUrl.replace(
        `https://${this.s3Bucket}.s3.${this.awsRegion}.amazonaws.com`,
        this.staticUrl,
      );

    return presignedUrl;
  }

  // Generate a presigned URL for uploading a file
  async putPresignedUrl(key: string, contentType?: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.PCP_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1-hour expiry
  }

  //Download a file from S3/MinIO as Buffer
  async getBufferFromS3(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: process.env.PCP_BUCKET_NAME,
      Key: key,
    });
    const response = await this.s3Client.send(command);

    const buffer = await this.streamToBuffer(response.Body as Readable);
    return buffer;
  }

  // Delete a file from S3/MinIO
  async deleteFile(fileKey: string): Promise<void> {
    if (!fileKey) {
      throw new Error('File key is required for deletion');
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.PCP_BUCKET_NAME,
      Key: fileKey,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error(`Error deleting file from S3: ${error.message}`);
      throw error;
    }
  }

  // Copy a file within S3/MinIO
  async copyFile(sourceKey: string, destinationKey: string) {
    const command = new CopyObjectCommand({
      Bucket: this.s3Bucket,
      CopySource: `${this.s3Bucket}/${sourceKey
        .split('/')
        .map(encodeURIComponent)
        .join('/')}`,
      Key: destinationKey,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error(`Error copying file from S3: ${error.message}`);
      throw error;
    }
  }

  // Move a file within S3/MinIO
  async moveObject(sourceKey: string, destinationKey: string): Promise<string> {
    await this.copyFile(sourceKey, destinationKey);
    await this.deleteFile(sourceKey);
    return destinationKey;
  }

  // Convert a readable stream to a Buffer
  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}
