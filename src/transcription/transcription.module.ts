import { Module } from '@nestjs/common';
import { TranscriptionController } from './transcription.controller';
import { TranscriptionService } from './transcription.service';
import { DeepgramService } from './deepgram.service';
import { FrontendDetectionService } from './frontend-detection.service';

@Module({
  controllers: [TranscriptionController],
  providers: [
    TranscriptionService, 
    DeepgramService, 
    FrontendDetectionService
  ],
})
export class TranscriptionModule {}