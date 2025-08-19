import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  UploadedFiles, 
  UseGuards, 
  Query,
  Get,
  Param,
  Res,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single image (admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or file too large' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string = 'products',
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.uploadService.uploadFile(file, folder);
    return {
      success: true,
      data: result,
    };
  }

  @Post('images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  @ApiOperation({ summary: 'Upload multiple images (admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid files or files too large' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder: string = 'products',
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const results = await this.uploadService.uploadMultipleFiles(files, folder);
    return {
      success: true,
      data: results,
    };
  }

  @Get('serve/:folder/:filename')
  @ApiOperation({ summary: 'Serve uploaded files (for local storage)' })
  @ApiResponse({ status: 200, description: 'File served successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  serveFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = path.join(process.cwd(), 'uploads', folder, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.sendFile(filePath);
  }
}