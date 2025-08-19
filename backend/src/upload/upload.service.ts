import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  key: string;
  originalName: string;
  size: number;
  mimeType: string;
}

@Injectable()
export class UploadService {
  private s3: AWS.S3;
  private useS3: boolean;
  private uploadDir: string;

  constructor(private configService: ConfigService) {
    this.useS3 = this.configService.get<boolean>('USE_S3_UPLOAD', false);
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');

    if (this.useS3) {
      this.s3 = new AWS.S3({
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
        region: this.configService.get<string>('AWS_REGION'),
      });
    } else {
      // Ensure upload directory exists
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }
    }
  }

  getMulterConfig(): multer.Options {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    const maxSize = 5 * 1024 * 1024; // 5MB

    if (this.useS3) {
      return {
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
          if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(null, false);
          }
        },
        limits: {
          fileSize: maxSize,
        },
      };
    } else {
      return {
        storage: multer.diskStorage({
          destination: (req, file, cb) => {
            cb(null, this.uploadDir);
          },
          filename: (req, file, cb) => {
            const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
            cb(null, uniqueName);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(null, false);
          }
        },
        limits: {
          fileSize: maxSize,
        },
      };
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'general'): Promise<UploadResult> {
    if (this.useS3) {
      return this.uploadToS3(file, folder);
    } else {
      return this.uploadToLocal(file, folder);
    }
  }

  async uploadMultipleFiles(files: Express.Multer.File[], folder: string = 'general'): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  private async uploadToS3(file: Express.Multer.File, folder: string): Promise<UploadResult> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    const key = `${folder}/${uuidv4()}${path.extname(file.originalname)}`;

    try {
      const uploadResult = await this.s3.upload({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      }).promise();

      return {
        url: uploadResult.Location,
        key: uploadResult.Key,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to upload file to S3: ${error.message}`);
    }
  }

  private async uploadToLocal(file: Express.Multer.File, folder: string): Promise<UploadResult> {
    const folderPath = path.join(this.uploadDir, folder);
    
    // Ensure folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(folderPath, filename);
    const baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:3000');

    try {
      // If file is in memory (multer.memoryStorage), write it to disk
      if (file.buffer) {
        fs.writeFileSync(filePath, file.buffer);
      }
      // If file is already on disk (multer.diskStorage), move it to the correct folder
      else if (file.path) {
        fs.renameSync(file.path, filePath);
      }

      return {
        url: `${baseUrl}/uploads/${folder}/${filename}`,
        key: `${folder}/${filename}`,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to save file locally: ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    if (this.useS3) {
      await this.deleteFromS3(key);
    } else {
      await this.deleteFromLocal(key);
    }
  }

  private async deleteFromS3(key: string): Promise<void> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');

    try {
      await this.s3.deleteObject({
        Bucket: bucketName,
        Key: key,
      }).promise();
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete file from S3: ${error.message}`);
    }
  }

  private async deleteFromLocal(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete local file: ${error.message}`);
    }
  }

  async optimizeImage(file: Express.Multer.File): Promise<Buffer> {
    // This would typically use a library like sharp for image optimization
    // For now, return the original buffer
    return file.buffer;
  }

  generateThumbnail(file: Express.Multer.File, width: number = 300, height: number = 300): Promise<Buffer> {
    // This would typically use a library like sharp to generate thumbnails
    // For now, return the original buffer
    return Promise.resolve(file.buffer);
  }

  validateImageDimensions(file: Express.Multer.File, minWidth?: number, minHeight?: number, maxWidth?: number, maxHeight?: number): boolean {
    // This would typically use a library like sharp to get image dimensions
    // For now, return true (validation passed)
    return true;
  }
}