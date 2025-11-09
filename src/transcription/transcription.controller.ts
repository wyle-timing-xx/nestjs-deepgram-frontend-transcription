import { 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors,
  BadRequestException,
  Body,
  Logger,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiConsumes, 
  ApiProduces, 
  ApiBody,
  ApiResponse
} from '@nestjs/swagger';
import { Express } from 'express';
import { TranscriptionService } from './transcription.service';
import { TranscriptionResponseDto, TranscriptionOptionsDto } from './dto/transcription.dto';

@ApiTags('transcription')
@Controller('transcription')
export class TranscriptionController {
  private readonly logger = new Logger(TranscriptionController.name);
  
  constructor(private readonly transcriptionService: TranscriptionService) {}

  @Post('audio')
  @ApiOperation({ summary: '上传音频文件进行转录和前端内容检测' })
  @ApiConsumes('multipart/form-data')
  @ApiProduces('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '要转录的音频文件',
        },
        options: {
          type: 'object',
          properties: {
            forceDetection: {
              type: 'boolean',
              description: '是否强制检测前端相关内容，即使相关性较低',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ 
    status: 200, 
    description: '转录成功', 
    type: TranscriptionResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: '请求错误或未提供音频文件' 
  })
  @ApiResponse({ 
    status: 500, 
    description: '服务器错误或转录失败' 
  })
  @UseInterceptors(FileInterceptor('file'))
  async transcribeAudio(
    @UploadedFile() file: Express.Multer.File,
    @Body() options?: TranscriptionOptionsDto,
  ): Promise<TranscriptionResponseDto> {
    if (!file) {
      throw new BadRequestException('未提供音频文件');
    }

    // 验证文件类型
    const validMimeTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 
      'audio/m4a', 'audio/mp4', 'audio/webm', 'audio/flac',
      'video/mp4', 'video/webm'
    ];
    
    if (!validMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `不支持的文件类型: ${file.mimetype}。支持的类型: ${validMimeTypes.join(', ')}`
      );
    }

    try {
      // 处理转录和分析
      const result = await this.transcriptionService.transcribeAndAnalyzeFile(file);
      
      // 根据用户设置和前端相关性过滤结果
      if (!options?.forceDetection && !result.isFrontendRelated) {
        this.logger.log(`File ${file.originalname} is not frontend related (score: ${result.relevanceScore})`);
        return {
          ...result,
          transcript: '内容与前端技术无关。',
          summary: '内容与前端技术无关。',
          frontendKeywordsDetected: []
        };
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Transcription failed: ${error.message}`, error.stack);
      throw new HttpException(
        `转录失败: ${error.message}`, 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}