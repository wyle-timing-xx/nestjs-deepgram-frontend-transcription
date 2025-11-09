import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@deepgram/sdk';
import * as fs from 'fs';

@Injectable()
export class DeepgramService implements OnModuleInit {
  private readonly logger = new Logger(DeepgramService.name);
  private deepgram: ReturnType<typeof createClient>;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('DEEPGRAM_API_KEY');
    
    if (!apiKey) {
      this.logger.warn('DEEPGRAM_API_KEY not provided. Transcription service will not work properly.');
      return;
    }
    
    this.deepgram = createClient(apiKey);
  }

  async transcribeFile(filePath: string): Promise<any> {
    this.logger.log(`Transcribing file: ${filePath}`);
    
    if (!this.deepgram) {
      throw new Error('Deepgram client not initialized. Please check your API key.');
    }

    try {
      const audioSource = {
        stream: fs.createReadStream(filePath),
        mimetype: this.getMimeType(filePath),
      };

      // 配置转录选项，可针对前端技术优化
      const response = await this.deepgram.listen.prerecorded.transcribeFile(audioSource, {
        smart_format: true,
        model: 'nova-2',
        detect_topics: true,
        summarize: true,
        detect_entities: true,
        utterances: true,
        diarize: true,
        language: 'zh-CN',
      });

      return response.results;
    } catch (error) {
      this.logger.error(`Transcription error: ${error.message}`, error.stack);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }

  async transcribeBuffer(buffer: Buffer, mimeType: string): Promise<any> {
    this.logger.log(`Transcribing buffer with mime type: ${mimeType}`);
    
    if (!this.deepgram) {
      throw new Error('Deepgram client not initialized. Please check your API key.');
    }

    try {
      const audioSource = {
        buffer,
        mimetype: mimeType,
      };

      // 配置转录选项，可针对前端技术优化
      const response = await this.deepgram.listen.prerecorded.transcribeFile(audioSource, {
        smart_format: true,
        model: 'nova-2',
        detect_topics: true,
        summarize: true,
        detect_entities: true,
        utterances: true,
        diarize: true,
        language: 'zh-CN',
      });

      return response.results;
    } catch (error) {
      this.logger.error(`Transcription error: ${error.message}`, error.stack);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }

  private getMimeType(filePath: string): string {
    const extension = filePath.split('.').pop().toLowerCase();
    
    const mimeTypes = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      m4a: 'audio/mp4',
      ogg: 'audio/ogg',
      flac: 'audio/flac',
      webm: 'audio/webm',
      mp4: 'video/mp4',
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
  }
}