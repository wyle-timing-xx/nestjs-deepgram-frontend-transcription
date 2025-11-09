import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import { DeepgramService } from './deepgram.service';
import { FrontendDetectionService } from './frontend-detection.service';

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);

  constructor(
    private readonly deepgramService: DeepgramService,
    private readonly frontendDetectionService: FrontendDetectionService,
  ) {}

  async transcribeAndAnalyzeFile(file: Express.Multer.File) {
    try {
      this.logger.log(`Processing file: ${file.originalname}`);
      
      // 转录音频
      const transcriptionResults = await this.deepgramService.transcribeBuffer(
        file.buffer,
        file.mimetype,
      );
      
      // 分析转录结果中的前端内容
      const analysis = this.frontendDetectionService.analyzeFrontendContent(
        transcriptionResults,
      );
      
      return {
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        ...analysis,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error processing file: ${error.message}`, error.stack);
      throw error;
    }
  }

  // 将上传的文件保存到临时目录
  async saveUploadedFile(file: Express.Multer.File): Promise<string> {
    // 创建唯一的临时文件名
    const tempDir = os.tmpdir();
    const uniquePrefix = crypto.randomBytes(16).toString('hex');
    const tempFilePath = path.join(tempDir, `${uniquePrefix}-${file.originalname}`);
    
    return new Promise((resolve, reject) => {
      // 写入临时文件
      fs.writeFile(tempFilePath, file.buffer, (err) => {
        if (err) {
          this.logger.error(`Failed to save temp file: ${err.message}`);
          reject(new Error(`Failed to save uploaded file: ${err.message}`));
        } else {
          resolve(tempFilePath);
        }
      });
    });
  }

  // 清理临时文件
  async cleanupTempFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`Cleaned up temp file: ${filePath}`);
      }
    } catch (error) {
      this.logger.warn(`Failed to clean up temp file: ${error.message}`);
    }
  }
}